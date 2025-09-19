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

// State that persists throughout the generation process
interface AgentState {
  summary: string;                    // Human-readable description of what was built
  files: Record<string, string>;      // Generated file paths and contents
}

// Event payload structure for triggering code generation
interface CodeAgentEventData {
  projectId: string;                  // Which project this belongs to
  value: string;                      // User's description/prompt
  models?: string[];                  // Optional custom model list
  modelRetries?: number;              // Optional retry count per model
}

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    // Validate API access
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) throw new Error("OPENROUTER_API_KEY is required");

    //  Step 1: Create isolated sandbox environment
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("zyncreacted");
      await sandbox.setTimeout(60_000 * 30); // 30 minute timeout for complex apps
      return sandbox.sandboxId;
    });

    //  Step 2: Load conversation history for context
    const previousMessages = await step.run(
      "get-previous-messages",
      async () => {
        const formatted: Message[] = [];
        const msgs = await prisma.message.findMany({
          where: { projectId: (event.data as CodeAgentEventData).projectId },
          orderBy: { createdAt: "desc" },
          take: 4, // Last 4 messages for context
        });
        
        // Convert to agent-kit message format
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

    //  Step 3: Determine model fallback chain
    const ed = event.data as CodeAgentEventData;
    const modelCandidates: string[] = (
      Array.isArray(ed.models)
        ? ed.models
        : process.env.MODEL_CANDIDATES?.split(",") ?? []
    ).filter((m): m is string => typeof m === "string" && !!m);
    
    // Default to free models if none specified
    if (modelCandidates.length === 0) {
      modelCandidates.push(
        "openrouter/sonoma-sky-alpha",
        "moonshotai/kimi-k2:free", 
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

    /**
     * Creates an AI agent configured for React app generation
     * Each agent has access to the createFiles tool for sandbox manipulation
     */
    const buildAgent = (modelName: string, attempt: number) =>
      createAgent<AgentState>({
        name: `code-agent-${modelName}-r${attempt}`,
        description: "An expert React coding agent",
        system: PROMPT, // Detailed instructions for React app generation
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
                  
                  // Write all files to sandbox
                  for (const f of files) {
                    await sandbox.files.write(f.path, f.content);
                    updated[f.path] = f.content;
                  }
                  console.log("🗂️ Created files:", Object.keys(updated));

                  // Import validation - ensure all relative imports resolve
                  const missing: { file: string; import: string }[] = [];
                  const pathSet = new Set(Object.keys(updated));
                  const importRegex = /import\s+[^"']*['\"]([^'\"]+)['\"]/g;
                  
                  for (const [p, content] of Object.entries(updated)) {
                    if (!/\.(t|j)sx?$/.test(p)) continue; // Only check JS/TS files
                    
                    let m: RegExpExecArray | null;
                    while ((m = importRegex.exec(content))) {
                      const spec = m[1];
                      
                      // Check relative imports
                      if (spec.startsWith(".") || spec.startsWith("../")) {
                        const baseDir = p.split("/").slice(0, -1).join("/");
                        const full =
                          (baseDir ? baseDir + "/" : "") +
                          spec.replace(/^\.\//, "");
                        
                        // Try common file extensions
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
                      } 
                      // Check @/ alias imports (require config)
                      else if (spec.startsWith("@/")) {
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
                      // Check for potentially problematic npm packages
                      else if (!spec.startsWith(".") && !spec.startsWith("react")) {
                        // Common packages that cause issues
                        const problematicPackages = [
                          "axios", "react-router-dom", "next", "express", 
                          "prisma", "@supabase/supabase-js", "firebase", 
                          "three", "@types/node", "framer-motion"
                        ];
                        
                        if (problematicPackages.some(pkg => spec.startsWith(pkg))) {
                          missing.push({
                            file: p,
                            import: spec + " (package likely not available in sandbox)",
                          });
                        }
                      }
                    }
                  }
                  
                  // Log validation results
                  if (missing.length) {
                    console.warn(
                      "❌ Import issues detected:",
                      missing
                    );
                    
                    // If there are critical missing imports, warn but don't fail
                    const hasPackageIssues = missing.some(m => 
                      m.import.includes("(package likely not available)")
                    );
                    
                    if (hasPackageIssues) {
                      console.warn("⚠️ Warning: Some packages may not be available in sandbox");
                    }
                  } else {
                    console.log(
                      "✅ Import validation passed (all imports look good)"
                    );
                  }
                  
                  //  Start development server in background
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
          // Extract summary from agent responses
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

    //  Step 4: Try models with exponential backoff on rate limits
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
            maxIter: 6, // Allow up to 6 iterations for complex apps
            defaultState: attemptState,
            router: async ({ network }) => {
              // Stop if we've successfully created files
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
            break outer; // Success! Exit all loops
          }
          console.log(" No files produced this attempt");
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          const rateLimited = /rate limit|429|too many requests|temporarily rate-limited|upstream.*rate/i.test(msg);
          console.log(
            ` Failure for ${modelName} attempt ${attempt}/${maxRetriesPerModel}: ${msg}`
          );
          
          //  FAST SWITCH: Move to next model immediately if rate limited
          if (rateLimited) {
            console.log(`🚨 RATE LIMITED on ${modelName} - SWITCHING MODELS IMMEDIATELY`);
            break; // Exit inner retry loop, move to next model
          }
          
          // For non-rate-limit errors, still do exponential backoff
          if (attempt < maxRetriesPerModel) {
            const delay = Math.min(4000, 500 * 2 ** (attempt - 1));
            console.log(` Non-rate-limit error; retrying ${modelName} after ${delay}ms`);
            await new Promise((r) => setTimeout(r, delay));
          }
        }
      }
    }

    //  All models failed - save error message
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

    //  Step 5: Generate human-friendly summaries with Gemini
    const result = runResult;
    const preliminarySummary =
      result.state.data.summary ||
      `Built a React app with ${
        Object.keys(result.state.data.files || {}).length
      } files: ${Object.keys(result.state.data.files || {})
        .slice(0, 8)
        .join(", ")}`;
        
    // Use Gemini for final summaries 
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

    // Generate fragment title and user response in parallel
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

    //  Step 6: Get public sandbox URL for live preview
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(5173);
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      return `${protocol}://${host}`;
    });

    //  Step 7: Save everything to database
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
          fragment: { 
            create: { 
              sandboxUrl, 
              title: fragmentTitle, 
              files 
            } 
          },
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
