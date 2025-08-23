import { inngest } from "./client";
import { prisma } from "@/lib/db";
import { PROMPT, RESPONSE_PROMPT, FRAGMENT_TITLE_PROMPT } from "@/prompts";
import {
  createAgent,
  createNetwork,
  createState,
  createTool,
  gemini,
  Message,
  openai,
  Tool,
} from "@inngest/agent-kit";
import { z } from "zod";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";

interface AgentState {
  summary: string;
  files: Record<string, string>;
}

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) throw new Error("OPENROUTER_API_KEY is required");

    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("zyncreacted");
      await sandbox.setTimeout(60_000 * 30); // 30 minutes
      return sandbox.sandboxId;
    });

    const previousMessages = await step.run(
      "get-previous-messages",
      async () => {
        const formatted: Message[] = [];
        const msgs = await prisma.message.findMany({
          where: { projectId: event.data.projectId },
          orderBy: { createdAt: "desc" },
          take: 4,
        });
        for (const m of msgs) {
          formatted.push({
            role: m.role === "ASSISTANT" ? "assistant" : "user",
            content: m.content,
            type: "text",
          });
        }
        return formatted.reverse();
      }
    );

    const evData = event.data as {
      models?: string[];
      projectId: string;
      value: string;
    };
    const modelCandidates: string[] = (
      Array.isArray(evData.models) && evData.models.length
        ? evData.models
        : process.env.OPENROUTER_FALLBACK_MODELS
        ? process.env.OPENROUTER_FALLBACK_MODELS.split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [
            "deepseek/deepseek-chat-v3-0324:free",
            "google/gemini-2.0-flash-exp:free",
            "qwen/qwen3-coder:free",
            "z-ai/glm-4.5-air:free",
          ]
    ).slice(0, 6);
    console.log("🎯 Model fallback list:", modelCandidates);

    type RunResult = { state: { data: AgentState } };
    let runResult: RunResult | null = null;
    let usedModel: string | null = null;

    for (const modelName of modelCandidates) {
      console.log(`\n🚀 Attempting model: ${modelName}`);
      const attemptStart = Date.now();
      try {
        const attemptState = createState<AgentState>(
          { summary: "", files: {} },
          { messages: previousMessages }
        );

        const attemptAgent = createAgent<AgentState>({
          name: `code-agent-${modelName}`,
          description: "An expert React coding agent",
          system: PROMPT,
          model: openai({
            model: modelName,
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
                    const updated = { ...network.state.data.files };
                    for (const f of files) {
                      await sandbox.files.write(f.path, f.content);
                      updated[f.path] = f.content;
                    }
                    sandbox.commands
                      .run(
                        "cd /home/user && npm run dev -- --host 0.0.0.0 --port 5173",
                        { background: true }
                      )
                      .catch(() => {});
                    return updated;
                  } catch (e) {
                    return `Error creating files: ${e}`;
                  }
                });
                if (res && typeof res === "object") {
                  network.state.data.files = res as Record<string, string>;
                  return `Created ${files.length} files.`;
                }
                return res || "Failed to create files";
              },
            }),
          ],
          lifecycle: {
            onResponse: async ({ result, network }) => {
              const txt = lastAssistantTextMessageContent(result);
              if (
                txt &&
                txt.includes("<task_summary>") &&
                txt.includes("</task_summary>")
              ) {
                const m = txt.match(/<task_summary>([\s\S]*?)<\/task_summary>/);
                if (m && network) network.state.data.summary = m[1].trim();
              }
              return result;
            },
          },
        });

        const attemptNetwork = createNetwork<AgentState>({
          name: `coding-agent-network-${modelName}`,
          agents: [attemptAgent],
          maxIter: 6,
          defaultState: attemptState,
          router: async ({ network }) => {
            if (Object.keys(network.state.data.files || {}).length > 0)
              return undefined;
            return attemptAgent;
          },
        });

        const r = (await attemptNetwork.run(event.data.value, {
          state: attemptState,
        })) as unknown as RunResult;
        const produced = Object.keys(r.state.data.files || {}).length;
        console.log(`📊 Model ${modelName} produced ${produced} files`);
        if (produced > 0) {
          runResult = r;
          usedModel = modelName;
          console.log(
            `✅ Success with ${modelName} in ${Date.now() - attemptStart}ms`
          );
          break;
        }
        console.log("⚠️ No files produced, trying next model");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`❌ Failure for ${modelName}: ${msg}`);
        if (/rate limit|429/i.test(msg))
          console.log("⏳ Rate limit -> switching immediately");
      }
    }

    if (!runResult) {
      await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: `All models failed or rate-limited. Tried: ${modelCandidates.join(
            ", "
          )}`,
          role: "ASSISTANT",
          type: "ERROR",
        },
      });
      return {
        success: false,
        triedModels: modelCandidates,
        error: "All models failed",
      };
    }

    const result = runResult;
    const summaryForGeneration =
      result.state.data.summary ||
      `Built a React app with ${
        Object.keys(result.state.data.files || {}).length
      } files.`;

    const titleAgent = createAgent({
      name: "fragment-title-generator",
      system: FRAGMENT_TITLE_PROMPT,
      model: gemini({ model: "gemini-2.0-flash" }),
    });
    const responseAgent = createAgent({
      name: "response-generator",
      system: RESPONSE_PROMPT,
      model: gemini({ model: "gemini-2.0-flash" }),
    });
    const [{ output: titleOut }, { output: respOut }] = await Promise.all([
      titleAgent.run(summaryForGeneration),
      responseAgent.run(summaryForGeneration),
    ]);

    interface TextChunk {
      type: string;
      content: string | string[];
    }
    const extractText = (out: unknown, fallback: string): string => {
      try {
        if (Array.isArray(out)) {
          const first = out[0] as TextChunk | undefined;
          if (first?.type === "text") {
            const c = first.content;
            return Array.isArray(c) ? c.join(" ") : c ?? fallback;
          }
        }
      } catch {
        /* ignore */
      }
      return fallback;
    };
    const fragmentTitle: string = extractText(titleOut, "React Component");
    const responseText: string = extractText(
      respOut,
      "Built your React component successfully!"
    );

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(5173);
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      return `${protocol}://${host}`;
    });

    const files = result.state.data.files || {};
    const summary = result.state.data.summary || "";
    const fileCount = Object.keys(files).length;
    const hasFiles = fileCount > 0;
    const hasSummary = summary.length > 0;

    const savedMessage = await step.run("save-result", async () => {
      if (!hasFiles) {
        return prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content:
              "Failed to create any files. Please try again with a clearer request.",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }
      return prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: responseText,
          role: "ASSISTANT",
          type: "RESULT",
          fragment: { create: { sandboxUrl, title: fragmentTitle, files } },
        },
        include: { fragment: true },
      });
    });

    console.log("🎉 Function completed", {
      messageId: savedMessage.id,
      usedModel,
      fileCount,
    });

    return {
      url: sandboxUrl,
      title: fragmentTitle,
      files,
      summary,
      fileCount,
      hasFiles,
      hasSummary,
      success: hasFiles,
      usedModel,
      triedModels: modelCandidates,
    };
  }
);
