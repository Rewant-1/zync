import { inngest } from "./client";
import {
  gemini,
  openai,
  createAgent,
  createTool,
  createNetwork,
  type Tool,
  type Message,
  createState,
} from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { z } from "zod";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompts";
import { prisma } from "@/lib/db";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const modelsToTry = [
      "qwen/qwen3-coder:free",
      "moonshotai/kimi-k2:free",
      "z-ai/glm-4.5-air:free",
    ];

  const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    // Guard: API key must be present (no point trying fallbacks without a key)
    if (!openRouterApiKey) {
      throw new Error("Missing OPENROUTER_API_KEY");
    }


    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("zyncreacted");
      await sandbox.setTimeout(60_000 * 10 * 3); // 30 minutes
      return sandbox.sandboxId;
    });

    

    const previousMessages = await step.run(
      "get-previous-messages",
      async () => {
        const formattedMessages: Message[] = [];
        const messages = await prisma.message.findMany({
          where: {
            projectId: event.data.projectId,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 4,
        });

        for (const message of messages) {
          formattedMessages.push({
            role: message.role === "ASSISTANT" ? "assistant" : "user",
            content: message.content,
            type: "text",
          });
        }
        return formattedMessages.reverse();
      }
    );

    const state = createState<AgentState>(
      {
        summary: "",
        files: {},
      },
      {
        messages: previousMessages,
      }
    );

    type MinimalRunResult = { state: { data: AgentState } };
    let runResult: MinimalRunResult | null = null;

  for (const model of modelsToTry) {
      try {
        const codeAgent = createAgent<AgentState>({
          name: "code-agent",
          description: "An expert React coding agent",
          system: PROMPT,
          model: openai({
            model,
            baseUrl: "https://openrouter.ai/api/v1",
            apiKey: openRouterApiKey,
          }),
          tools: [
            createTool({
              name: "createFiles",
              description:
                "Create files in the sandbox - MUST be used to build the app",
              parameters: z.object({
                files: z
                  .array(
                    z.object({
                      path: z
                        .string()
                        .describe("File path relative to /home/user"),
                      content: z.string().describe("Complete file content"),
                    })
                  )
                  .min(1, "Must create at least one file"),
              }),
              handler: async (
                { files },
                { step, network }: Tool.Options<AgentState>
              ) => {
                const res = await step?.run("createFiles", async () => {
                  try {
                    const sandbox = await getSandbox(sandboxId);
                    const updatedFiles = { ...network.state.data.files };

                    for (const file of files) {
                      await sandbox.files.write(file.path, file.content);
                      updatedFiles[file.path] = file.content;
                    }

                    await sandbox.commands.run(
                      "cd /home/user && npm run dev -- --host 0.0.0.0 --port 5173",
                      {
                        background: true,
                      }
                    );

                    return updatedFiles;
                  } catch (e) {
                    return `Error creating files: ${e}`;
                  }
                });

                if (typeof res === "object" && res !== null) {
                  network.state.data.files = res as Record<string, string>;
                  return `Successfully created ${
                    files.length
                  } files and started dev server: ${files
                    .map((f) => f.path)
                    .join(", ")}`;
                } else {
                  return res || "Failed to create files";
                }
              },
            }),
          ],
          lifecycle: {
            onResponse: async ({ result, network }) => {
              const lastAssistantMessageText =
                lastAssistantTextMessageContent(result);

              if (lastAssistantMessageText && network) {
                if (
                  lastAssistantMessageText.includes("<task_summary>") &&
                  lastAssistantMessageText.includes("</task_summary>")
                ) {
                  const summaryMatch = lastAssistantMessageText.match(
                    /<task_summary>([\s\S]*?)<\/task_summary>/
                  );
                  if (summaryMatch) {
                    network.state.data.summary = summaryMatch[1].trim();
                  }
                }
              }

              return result;
            },
          },
        });

        const network = createNetwork<AgentState>({
          name: "coding-agent-network",
          agents: [codeAgent],
          maxIter: 1,
          defaultState: state,
          router: async ({ network }) => {
            const currentFiles = Object.keys(network.state.data.files || {});
            const hasFiles = currentFiles.length > 0;
            if (hasFiles) {
              return undefined;
            }
            return codeAgent;
          },
        });

        
        

        const result = (await network.run(event.data.value, {
          state,
        })) as unknown as MinimalRunResult;

        const n = Object.keys(result.state.data.files || {}).length;
        if (n > 0) {
          runResult = result;
          
          break;
        } else {
          continue;
        }
      } catch (error: unknown) {
        const status = (error as { cause?: { status?: number } })?.cause?.status;
        const shouldFallback =
          status === 429 ||
          status === 408 ||
          (typeof status === "number" && status >= 500 && status < 600) ||
          typeof status === "undefined"; // network or unknown error

        if (shouldFallback) {
          continue;
        }
        // Non-retriable errors (e.g., 401/403) – surface immediately
        throw error;
      }
    }

    if (!runResult) {
      await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content:
            "Sorry, all available AI models are currently busy. Please try again in a few minutes.",
          role: "ASSISTANT",
          type: "ERROR",
        },
      });
      throw new Error("All fallback models were rate-limited or failed.");
    }

    const summaryForGeneration =
      runResult.state.data.summary ||
      `Built a React application with ${
        Object.keys(runResult.state.data.files || {}).length
      } files: ${Object.keys(runResult.state.data.files || {}).join(", ")}`;

    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "Generate a concise title for the code fragment",
      system: FRAGMENT_TITLE_PROMPT,
      model: gemini({ model: "gemini-2.0-flash" }),
    });

    const responseGenerator = createAgent({
      name: "response-generator",
      description: "Generate a user-friendly response",
      system: RESPONSE_PROMPT,
      model: gemini({ model: "gemini-2.0-flash" }),
    });

    const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(
      summaryForGeneration
    );
    const { output: responseOutput } = await responseGenerator.run(
      summaryForGeneration
    );

    const generateFragmentTitle = () => {
      try {
        if (fragmentTitleOutput?.[0]?.type === "text") {
          const content = fragmentTitleOutput[0].content;
          if (Array.isArray(content)) {
            return content.join(" ");
          }
          return content || "React Component";
        }
      } catch (e) {
        console.error("Error generating title:", e);
      }
      return "React Component";
    };

    const generateResponse = () => {
      try {
        if (responseOutput?.[0]?.type === "text") {
          const content = responseOutput[0].content;
          if (Array.isArray(content)) {
            return content.join(" ");
          }
          return content || "Built your React component successfully!";
        }
      } catch (e) {
        console.error("Error generating response:", e);
      }
      return "Built your React component successfully!";
    };

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(5173);
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      return `${protocol}://${host}`;
    });

    

    const files = runResult.state.data.files || {};
    const fileCount = Object.keys(files).length;
    const hasFiles = fileCount > 0;
    const summary = runResult.state.data.summary || "";
    const hasSummary = summary.length > 0;

    await step.run("save-result", async () => {
      if (!hasFiles) {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content:
              "Failed to create any files. The agent needs to use the createFiles tool to build your app. Please try again with a clearer request.",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }

      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: generateResponse(),
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: generateFragmentTitle(),
              files: files,
            },
          },
        },
        include: {
          fragment: true,
        },
      });
    });

    return {
      url: sandboxUrl,
      title: generateFragmentTitle(),
      files: files,
      summary: summary,
      fileCount,
      hasFiles,
      hasSummary,
      success: hasFiles,
    };
  }
);
