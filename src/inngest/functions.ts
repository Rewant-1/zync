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
  { 
    id: "code-agent",
    concurrency: { limit: 10 }, 
  },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const modelsToTry = [
      "moonshotai/kimi-k2:free", 
      "qwen/qwen3-coder:free",
      "z-ai/glm-4.5-air:free",
    ];

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    if (!openRouterApiKey) {
      throw new Error("Missing OPENROUTER_API_KEY");
    }

    const [sandboxId, previousMessages] = await Promise.all([
      step.run("get-sandbox-id", async () => {
        const sandbox = await Sandbox.create("zyncreacted");
        await sandbox.setTimeout(60_000 * 15); // Reduced from 30 to 15 minutes
        return sandbox.sandboxId;
      }),
      step.run("get-previous-messages", async () => {
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
      })
    ]);

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
        console.log(`🤖 Trying model: ${model}`);
        
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

                    await Promise.all(
                      files.map(async (file) => {
                        await sandbox.files.write(file.path, file.content);
                        updatedFiles[file.path] = file.content;
                      })
                    );

                    sandbox.commands.run(
                      "cd /home/user && npm run dev -- --host 0.0.0.0 --port 5173",
                      { background: true }
                    ).catch(() => {}); 

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
          maxIter: 2, 
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
          console.log(`✅ Model ${model} succeeded with ${n} files`);
          runResult = result;
          break; 
        } else {
          console.log(`⚠️ Model ${model} returned no files, trying next model`);
          continue;
        }
      } catch (error: unknown) {
        console.log(`❌ Model ${model} failed:`, error);
        
        // More comprehensive error checking for different error formats
        const errorObj = error as {
          status?: number;
          cause?: { status?: number };
          response?: { status?: number };
          error?: { status?: number };
          message?: string;
        };
        
        const status = 
          errorObj?.status || 
          errorObj?.cause?.status || 
          errorObj?.response?.status ||
          errorObj?.error?.status;

        // Only stop trying models if it's an API key authentication error
        // Everything else should fall back to the next model
        const isApiKeyError = (status === 401 || status === 403) && 
                             (errorObj?.message?.includes?.('api') || 
                              errorObj?.message?.includes?.('auth') || 
                              errorObj?.message?.includes?.('key'));
        
        if (isApiKeyError) {
          console.log(`� API key authentication error, stopping all attempts`);
          throw error;
        }
        
        console.log(`� Model ${model} failed (status: ${status}), trying next model...`);
        continue;
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

    const [
      { output: fragmentTitleOutput },
      { output: responseOutput },
      sandboxUrl
    ] = await Promise.all([
      createAgent({
        name: "fragment-title-generator",
        description: "Generate a concise title for the code fragment",
        system: FRAGMENT_TITLE_PROMPT,
        model: gemini({ model: "gemini-2.0-flash" }),
      }).run(summaryForGeneration),
      
      createAgent({
        name: "response-generator", 
        description: "Generate a user-friendly response",
        system: RESPONSE_PROMPT,
        model: gemini({ model: "gemini-2.0-flash" }),
      }).run(summaryForGeneration),
      
      step.run("get-sandbox-url", async () => {
        const sandbox = await getSandbox(sandboxId);
        const host = sandbox.getHost(5173);
        const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
        return `${protocol}://${host}`;
      })
    ]);

    const generateFragmentTitle = () => {
      try {
        if (fragmentTitleOutput?.[0]?.type === "text") {
          const content = fragmentTitleOutput[0].content;
          if (Array.isArray(content)) {
            return content.join(" ");
          }
          return content || "React Component";
        }
      } catch {
        
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
      } catch {
        
      }
      return "Built your React component successfully!";
    };

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