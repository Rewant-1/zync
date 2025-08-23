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

interface CodeAgentEventData {
  projectId: string;
  value: string;
  models?: string[];
  modelRetries?: number;
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
          where: { projectId: (event.data as CodeAgentEventData).projectId },
          orderBy: { createdAt: "desc" },
          take: 4,
        });
        for (const m of msgs) {
          if (m.role === "ASSISTANT") {
            formatted.push({
              role: "assistant",
              type: "text",
              content: m.content,
            });
          } else if (m.role === "USER") {
            formatted.push({ role: "user", type: "text", content: m.content });
          }
        }
        return formatted.reverse();
      }
    );

    const ed = event.data as CodeAgentEventData;
    const modelCandidates: string[] = (
      Array.isArray(ed.models)
        ? ed.models
        : process.env.MODEL_CANDIDATES?.split(",") ?? []
    ).filter((m): m is string => typeof m === "string" && !!m);
    if (modelCandidates.length === 0) {
      modelCandidates.push(
        "deepseek/deepseek-chat-v3-0324:free",
        "google/gemini-2.0-flash-exp:free",
        "qwen/qwen3-coder:free",
        "z-ai/glm-4.5-air:free"
      );
    }
    console.log("Model candidates:", modelCandidates);

    type RunResult = { state: { data: AgentState } };
    let runResult: RunResult | null = null;
    let usedModel: string | null = null;
    const maxRetriesPerModel = Math.max(
      1,
      Number(
        ed.modelRetries ??
          (process.env.MODEL_RETRIES ? Number(process.env.MODEL_RETRIES) : 1)
      )
    );

    const buildAgent = (modelName: string, attempt: number) =>
      createAgent<AgentState>({
        name: `code-agent-${modelName}-r${attempt}`,
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
                  console.log("🗂️ Created files:", Object.keys(updated));

                  const missing: { file: string; import: string }[] = [];
                  const pathSet = new Set(Object.keys(updated));
                  const importRegex = /import\s+[^"']*['\"]([^'\"]+)['\"]/g;
                  for (const [p, content] of Object.entries(updated)) {
                    if (!/\.(t|j)sx?$/.test(p)) continue;
                    let m: RegExpExecArray | null;
                    while ((m = importRegex.exec(content))) {
                      const spec = m[1];
                      if (spec.startsWith(".") || spec.startsWith("../")) {
                        const baseDir = p.split("/").slice(0, -1).join("/");
                        const full =
                          (baseDir ? baseDir + "/" : "") +
                          spec.replace(/^\.\//, "");
                        const candidates = [
                          full,
                          full + ".ts",
                          full + ".tsx",
                          full + ".js",
                          full + ".jsx",
                          full + "/index.ts",
                          full + "/index.tsx",
                        ];
                        if (!candidates.some((c) => pathSet.has(c))) {
                          missing.push({ file: p, import: spec });
                        }
                      } else if (spec.startsWith("@/")) {
                        const hasTsconfig = pathSet.has("tsconfig.json");
                        const hasVite =
                          pathSet.has("vite.config.ts") ||
                          pathSet.has("vite.config.js");
                        if (!hasTsconfig || !hasVite) {
                          missing.push({
                            file: p,
                            import: spec + " (alias without config)",
                          });
                        }
                      }
                    }
                  }
                  if (missing.length) {
                    console.warn(
                      "⚠️ Missing import targets detected:",
                      missing
                    );
                  } else {
                    console.log(
                      "✅ Import validation passed (all relative imports resolved)"
                    );
                  }
                  getSandbox(sandboxId)
                    .then((s) =>
                      s.commands
                        .run(
                          "cd /home/user && npm run dev -- --host 0.0.0.0 --port 5173",
                          { background: true }
                        )
                        .catch(() => {})
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

    outer: for (const modelName of modelCandidates) {
      for (let attempt = 1; attempt <= maxRetriesPerModel; attempt++) {
        console.log(
          `\n🚀 Model ${modelName} attempt ${attempt}/${maxRetriesPerModel}`
        );
        const attemptStart = Date.now();
        try {
          const attemptState = createState<AgentState>(
            { summary: "", files: {} },
            { messages: previousMessages || [] }
          );
          const agent = buildAgent(modelName, attempt);
          const network = createNetwork<AgentState>({
            name: `coding-agent-network-${modelName}-r${attempt}`,
            agents: [agent],
            maxIter: 6,
            defaultState: attemptState,
            router: async ({ network }) => {
              if (Object.keys(network.state.data.files || {}).length > 0)
                return undefined;
              return agent;
            },
          });
          const r = (await network.run(ed.value, {
            state: attemptState,
          })) as unknown as RunResult;
          const produced = Object.keys(r.state.data.files || {}).length;
          console.log(
            `📊 Model ${modelName} attempt ${attempt} produced ${produced} files`
          );
          if (produced > 0) {
            runResult = r;
            usedModel = modelName;
            console.log(
              `✅ Success with ${modelName} attempt ${attempt} in ${
                Date.now() - attemptStart
              }ms`
            );
            break outer;
          }
          console.log("⚠️ No files produced this attempt");
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          const rateLimited = /rate limit|429/i.test(msg);
          console.log(
            `❌ Failure for ${modelName} attempt ${attempt}/${maxRetriesPerModel}: ${msg}`
          );
          if (rateLimited && attempt < maxRetriesPerModel) {
            const delay = Math.min(4000, 500 * 2 ** (attempt - 1));
            console.log(`⏳ Rate limited; retrying after ${delay}ms`);
            await new Promise((r) => setTimeout(r, delay));
          }
        }
      }
    }

    if (!runResult) {
      await prisma.message.create({
        data: {
          projectId: ed.projectId,
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
    const preliminarySummary =
      result.state.data.summary ||
      `Built a React app with ${
        Object.keys(result.state.data.files || {}).length
      } files: ${Object.keys(result.state.data.files || {})
        .slice(0, 8)
        .join(", ")}`;
    const summarizer = createAgent({
      name: "fragment-summarizer",
      system:
        "You receive a rough description of code that was generated. Return one concise sentence (<=28 words) summarizing the app. No prefixes.",
      model: gemini({ model: "gemini-2.0-flash" }),
    });
    let finalSummary = preliminarySummary;
    try {
      const { output } = await summarizer.run(preliminarySummary);
      if (Array.isArray(output) && output[0]?.type === "text") {
        const first = output[0] as {
          type: string;
          content?: string | string[];
        };
        const c = first.content;
        finalSummary = Array.isArray(c) ? c.join(" ") : c || preliminarySummary;
      }
    } catch {}

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
      titleAgent.run(finalSummary),
      responseAgent.run(finalSummary),
    ]);
    interface TextChunk {
      type: string;
      content?: string | string[];
    }
    const extract = (out: unknown, fb: string) => {
      try {
        if (Array.isArray(out)) {
          const first = out[0] as TextChunk;
          if (first?.type === "text" && first.content)
            return Array.isArray(first.content)
              ? first.content.join(" ")
              : first.content;
        }
      } catch {}
      return fb;
    };
    const fragmentTitle = extract(titleOut, "React Component");
    const responseText = extract(
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
    const summary = finalSummary;
    const fileCount = Object.keys(files).length;
    const hasFiles = fileCount > 0;
    const hasSummary = summary.length > 0;

    const savedMessage = await step.run("save-result", async () => {
      if (!hasFiles) {
        return prisma.message.create({
          data: {
            projectId: ed.projectId,
            content:
              "Failed to create any files. Please try again with a clearer request.",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }
      return prisma.message.create({
        data: {
          projectId: ed.projectId,
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
