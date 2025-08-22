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
  // start

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      throw new Error("OPENROUTER_API_KEY is required");
    }

    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("zyncreacted");
      await sandbox.setTimeout(60_000 * 10 * 3);
      return sandbox.sandboxId;
    });
    const previousMessages = await step.run("get-previous-messages", async () => {
      const list: Message[] = [];
      const rows = await prisma.message.findMany({
        where: { projectId: event.data.projectId },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { role: true, content: true },
      });
      for (const row of rows) {
        list.push({
          role: row.role === "ASSISTANT" ? "assistant" : "user",
          content: row.content,
          type: "text",
        });
      }
      return list.reverse();
    });

    const state = createState<AgentState>(
      {
        summary: "",
        files: {},
      },
      {
        messages: previousMessages,
      }
    );

    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description: "An expert React coding agent",
      system: PROMPT,
      model: openai({
        model: "moonshotai/kimi-k2:free",
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
                  path: z.string().describe("File path relative to /home/user"),
                  content: z.string().describe("Complete file content"),
                })
              )
              .min(1, "Must create at least one file"),
          }),
          handler: async (
            { files },
            { step, network }: Tool.Options<AgentState>
          ) => {
            console.log(
              "🔨 Creating files:",
              files.map((f) => f.path)
            );

            const result = await step?.run("createFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const updatedFiles = { ...network.state.data.files };
                console.log(`📝 Writing ${files.length} files...`);
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }
                console.log("🚀 Starting Vite dev server...");
                sandbox.commands.run(
                  "cd /home/user && npm run dev -- --host 0.0.0.0 --port 5173",
                  { background: true }
                ).catch(() => {});
                console.log(`✅ Created ${files.length} files successfully`);
                return updatedFiles;
              } catch (e) {
                console.error("❌ Error creating files:", e);
                return `Error creating files: ${e}`;
              }
            });

            if (typeof result === "object" && result !== null) {
              network.state.data.files = result;
              console.log(
                "📊 Updated agent state with files:",
                Object.keys(result)
              );
              return `Successfully created ${
                files.length
              } files and started dev server: ${files
                .map((f) => f.path)
                .join(", ")}`;
            } else {
              console.error("❌ File creation failed:", result);
              return result || "Failed to create files";
            }
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);

          if (lastAssistantMessageText && network) {
            // Extract task summary
            if (
              lastAssistantMessageText.includes("<task_summary>") &&
              lastAssistantMessageText.includes("</task_summary>")
            ) {
              const summaryMatch = lastAssistantMessageText.match(
                /<task_summary>([\s\S]*?)<\/task_summary>/
              );
              if (summaryMatch) {
                network.state.data.summary = summaryMatch[1].trim();
                console.log(
                  "📝 Extracted summary:",
                  network.state.data.summary
                );
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
      maxIter: 4,
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

    console.log("🚀 Starting agent network...");
    const result = await network.run(event.data.value, { state }) as { state: { data: AgentState } };

    // Early abort: no files produced
    if (!result.state.data.files || Object.keys(result.state.data.files).length === 0) {
      await step.run("save-empty-result", async () => {
        await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Failed to create any files. The agent needs to use the createFiles tool to build your app. Please try again with a clearer request.",
            role: "ASSISTANT",
            type: "ERROR"
          }
        });
      });
      return {
        url: null,
        title: null,
        files: {},
        summary: "",
        fileCount: 0,
        hasFiles: false,
        hasSummary: false,
        success: false
      };
    }

    console.log("🏁 Agent network completed:", {
      summary: result.state.data.summary,
      fileCount: Object.keys(result.state.data.files || {}).length,
      files: Object.keys(result.state.data.files || {}),
    });

    const summaryForGeneration =
      result.state.data.summary ||
      `Built a React application with ${
        Object.keys(result.state.data.files || {}).length
      } files: ${Object.keys(result.state.data.files || {}).join(", ")}`;

    const [fragmentTitleOutput, responseOutput] = await Promise.all([
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
    ]);

    const generateFragmentTitle = () => {
      try {
        if (fragmentTitleOutput?.output?.[0]?.type === "text") {
          const content = fragmentTitleOutput.output[0].content;
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
        if (responseOutput?.output?.[0]?.type === "text") {
          const content = responseOutput.output[0].content;
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

    // Get sandbox URL
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(5173); // Changed to Vite's port
      // Force HTTPS for deployed environments to avoid mixed content issues
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      return `${protocol}://${host}`;
    });

    const files = result.state.data.files || {};
    const fileCount = Object.keys(files).length;
    const hasFiles = fileCount > 0;
    const summary = result.state.data.summary || "";
    const hasSummary = summary.length > 0;

    console.log("💾 Saving to database:", {
      fileCount,
      hasFiles,
      hasSummary,
      summaryLength: summary.length,
      success: hasFiles && hasSummary,
    });

    const savedMessage = await step.run("save-result", async () => {
      if (!hasFiles) {
        console.log("❌ No files created - saving error message");
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

      console.log(
        "✅ Files created successfully - saving result with fragment"
      );
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

    console.log("🎉 Function completed:", {
      messageId: savedMessage.id,
      url: sandboxUrl,
      fileCount,

      success: hasFiles,
      title: generateFragmentTitle(),
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
