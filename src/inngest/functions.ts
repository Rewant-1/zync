import {  inngest } from "./client";
import {  gemini, createAgent, createTool, createNetwork,type Tool,type Message, createState } from "@inngest/agent-kit";
import {Sandbox } from "@e2b/code-interpreter"
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { z } from "zod";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompts";
import {prisma} from "@/lib/db";

interface AgentState{
  summary:string;
  files:{[path: string]: string};
}
export const codeAgentFunction = inngest.createFunction(
  { id: "elite-react-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("initialize-elite-sandbox", async () => {
    const sandbox= await Sandbox.create("zyncreact");
    await sandbox.setTimeout(60_000*10*6); // 60 minutes - extended for complex builds
    return sandbox.sandboxId
    });

const previousMessages = await step.run("get-context-messages", async () => {
  const formattedMessages:Message[]=[];
  const messages = await prisma.message.findMany({
    where: {
      projectId: event.data.projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take:8, // Increased context for better continuity
  });
  for (const message of messages) {
    formattedMessages.push({
      role: message.role==="ASSISTANT" ? "assistant" : "user",
      content: message.content,
      type: "text",
    });
  }
  return formattedMessages.reverse();
})

const state = createState<AgentState>({
  summary: "",
  files: {},
},
{messages:previousMessages,})
    
    const eliteReactAgent = createAgent<AgentState>({
      name: "elite-react-vite-agent",
      description: "Elite React + Vite coding agent optimized for Gemini 2.0 Flash with hyperproductivity patterns and fail-safe mechanisms",
      system: PROMPT,
      model: gemini({ 
        model: "gemini-2.0-flash"
      }),
      tools:[
        createTool({
          name:"terminal",
          description:"Execute terminal commands with enhanced error handling and output management",
          parameters:z.object({
            command:z.string(),
          }),
          handler: async ({command}, {step})=>{
            return await step?.run("execute-terminal-command", async()=>{
              const buffers={stdout:"",stderr:""};
              try {
                const sandbox = await getSandbox(sandboxId);
                
                // Enhanced command execution with better error handling
                const result=await sandbox.commands.run(command,{
                  timeoutMs: 120000, // 2 minute timeout for complex operations
                  onStdout: (data:string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data:string) => {
                    buffers.stderr += data;
                  },
                });
                
                // Return success with full output
                if (buffers.stderr && !buffers.stdout) {
                  return `Warning: ${buffers.stderr}`;
                }
                return buffers.stdout || result.stdout || "Command executed successfully";
                
              } catch (e) {
                console.error(
                  `Terminal command failed: ${command}\nError: ${e}\nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`
                );
                
                // Enhanced error response with suggestions
                let errorMsg = `Command failed: ${command}\nError: ${e}`;
                if (buffers.stdout) errorMsg += `\nOutput: ${buffers.stdout}`;
                if (buffers.stderr) errorMsg += `\nError details: ${buffers.stderr}`;
                
                return errorMsg;
              }
            })
          }
        }),
        createTool({
          name:"createOrUpdateFiles",
          description:"Create or update multiple files with enhanced validation and error recovery",
          parameters:z.object({
            files:z.array(
              z.object({
                path:z.string(),
                content:z.string(),
              }),
        )}),
        handler: async ({files}, {step, network}:Tool.Options<AgentState>)=>{
          const newFiles=await step?.run("create-update-files", async()=>{
            try {
              const updateFiles=network.state.data.files || {};
              const sandbox =await getSandbox(sandboxId);
              const results = [];
              
              for (const file of files){
                try {
                  // Ensure directory exists
                  const dir = file.path.substring(0, file.path.lastIndexOf('/'));
                  if (dir) {
                    await sandbox.commands.run(`mkdir -p "${dir}"`);
                  }
                  
                  // Write file with validation
                  await sandbox.files.write(file.path, file.content);
                  updateFiles[file.path] = file.content;
                  results.push(`✅ Created/Updated: ${file.path}`);
                  
                  // Auto-format TypeScript/JavaScript files
                  if (file.path.endsWith('.ts') || file.path.endsWith('.tsx') || file.path.endsWith('.js') || file.path.endsWith('.jsx')) {
                    try {
                      await sandbox.commands.run(`npx prettier --write "${file.path}" 2>/dev/null || true`);
                    } catch {
                      // Ignore formatting errors, file is still created
                    }
                  }
                  
                } catch (fileError) {
                  results.push(`❌ Failed to create ${file.path}: ${fileError}`);
                }
              }
              
              return {
                files: updateFiles,
                summary: results.join('\n')
              };
              
            } catch (e) {
              return {
                error: `File operation failed: ${e}`,
                files: network.state.data.files || {}
              };
            }
        });
        
        if(typeof newFiles==="object" && newFiles){
          if('files' in newFiles) {
            network.state.data.files = newFiles.files;
            return "Files processed successfully";
          }
        }
        return "File operation completed";
        }}),
        createTool({
          name:"readFiles",
          description:"Read multiple files with enhanced error handling and content validation",
          parameters:z.object({
            files:z.array(z.string()), 
          }),
          handler: async ({files}, {step})=>{
            return await step?.run("read-files", async ()=>{
              try {
                const sandbox= await getSandbox(sandboxId);
                const contents=[];
                const errors=[];
                
                for (const file of files){
                  try {
                    const content=await sandbox.files.read(file);
                    contents.push({
                      path: file,
                      content: content,
                      status: "success"
                    });
                  } catch (fileError) {
                    errors.push({
                      path: file,
                      error: `Failed to read ${file}: ${fileError}`,
                      status: "error"
                    });
                  }
                }
                
                const result = {
                  files: contents,
                  errors: errors.length > 0 ? errors : null,
                  summary: `Read ${contents.length} files successfully${errors.length > 0 ? `, ${errors.length} failed` : ''}`
                };
                
                return JSON.stringify(result, null, 2);
                
              } catch (e) {
                return JSON.stringify({
                  error: `Read operation failed: ${e}`,
                  files: [],
                  summary: "Failed to read files"
                }, null, 2);
              }
            })
          }
        }),
        // Enhanced dependency installation tool
        createTool({
          name:"installDependencies",
          description:"Install npm packages with enhanced validation and conflict resolution",
          parameters:z.object({
            packages:z.array(z.string()),
            dev:z.boolean().optional().default(false),
          }),
          handler: async ({packages, dev}, {step})=>{
            return await step?.run("install-dependencies", async ()=>{
              try {
                const sandbox = await getSandbox(sandboxId);
                const flag = dev ? '--save-dev' : '--save';
                const packageList = packages.join(' ');
                
                const result = await sandbox.commands.run(
                  `npm install ${packageList} ${flag} --yes --no-audit --no-fund`,
                  { timeoutMs: 180000 } // 3 minutes for package installation
                );
                
                return `✅ Successfully installed: ${packageList}\n${result.stdout}`;
              } catch (e) {
                return `❌ Package installation failed: ${e}`;
              }
            })
          }
        })
      ],
      lifecycle:{
        onResponse: async ({result, network}) => {
          const lastAssistantMessageText = lastAssistantTextMessageContent(result);
          
          if (lastAssistantMessageText && network){
            // Enhanced task completion detection with multiple patterns
            const taskCompletionPatterns = [
              /<task_summary>([\s\S]*?)<\/task_summary>/,
              /Task completed:/i,
              /Implementation finished/i,
              /✅ Complete/i
            ];
            
            // Check for task summary tags (primary method)
            if(lastAssistantMessageText?.includes("<task_summary>") && lastAssistantMessageText?.includes("</task_summary>")){
              const summaryMatch = lastAssistantMessageText.match(taskCompletionPatterns[0]);
              if (summaryMatch) {
                network.state.data.summary = summaryMatch[1].trim();
                console.log(`✅ Elite React Agent completed task: ${network.state.data.summary}`);
              }
            }
            
            // Enhanced validation: ensure we have created meaningful files
            const hasFiles = Object.keys(network.state.data.files || {}).length > 0;
            const hasMainComponent = Object.keys(network.state.data.files || {}).some(path => 
              path.includes('App.tsx') || path.includes('components/') || path.includes('main.tsx')
            );
            
            if (network.state.data.summary && !hasFiles) {
              // Task marked complete but no files created - continue working
              network.state.data.summary = "";
              console.log("⚠️ Task marked complete but no files created - continuing...");
            }
            
            if (network.state.data.summary && hasFiles && !hasMainComponent) {
              // Files created but missing core React components - validate completion
              console.log("⚠️ Files created but missing core React components - validating...");
            }
          }
          return result;
        }
    }

    });

    const eliteReactNetwork = createNetwork<AgentState>({
      name:"elite-react-agent-network",
      agents:[eliteReactAgent],
      maxIter:20, // Increased iterations for complex React builds
      defaultState: state,
      router:async({network})=>{
        const summary= network.state.data.summary;
        const hasFiles = Object.keys(network.state.data.files || {}).length > 0;
        
        // Enhanced completion logic
        if (summary && hasFiles) {
          console.log(`🏁 Elite React Agent completed with ${Object.keys(network.state.data.files).length} files`);
          return ;
        }
        
        // Continue with elite agent
        return eliteReactAgent;
      }
    })

const result=await eliteReactNetwork.run(event.data.value,{state});
const eliteFragmentTitleGenerator=createAgent({
  name:"elite-fragment-title-generator",
  description:"Generate descriptive titles for React components and features with technical precision",
  system:FRAGMENT_TITLE_PROMPT,
  model: gemini({ model: "gemini-2.0-flash-lite" }),
})

const eliteResponseGenerator=createAgent({
  name:"elite-response-generator",
  description:"Generate professional, engaging responses for completed React development tasks",
  system:RESPONSE_PROMPT,
  model: gemini({ model: "gemini-2.0-flash-lite" }),
})

const {
  output:fragmentTitleOutput
} = await eliteFragmentTitleGenerator.run(result.state.data.summary);
const {
  output:responseOutput
} = await eliteResponseGenerator.run(result.state.data.summary);
const generateFragmentTitle=()=>{
  if (fragmentTitleOutput[0].type !== "text" ) {
    return "Fragment";
  }
 if(Array.isArray(fragmentTitleOutput[0].content)){
  return fragmentTitleOutput[0].content.map((txt)=>txt).join(" ");
 } 
 else{
  return fragmentTitleOutput[0].content;
 }
};
const generateResponse=()=>{
  if (responseOutput[0].type !== "text" ) {
    return "Here you GO!";
  }
 if(Array.isArray(responseOutput[0].content)){
  return responseOutput[0].content.map((txt)=>txt).join(" ");
 } 
 else{
  return responseOutput[0].content;
 }
}

// Enhanced validation with specific React project requirements
const isError = !result.state.data.summary ||
Object.keys(result.state.data.files || {}).length === 0 ||
!Object.keys(result.state.data.files || {}).some(path => 
  path.includes('.tsx') || path.includes('.jsx') || path.includes('App.tsx')
);

const sandboxUrl=await step.run("get-elite-sandbox-url", async ()=> {
  const sandbox = await getSandbox(sandboxId);
  const host = sandbox.getHost(5173);
  return `http://${host}`;
})

await step.run("save-elite-result", async () => {
if (isError) {
  console.error(`❌ Elite React Agent failed - Summary: ${!!result.state.data.summary}, Files: ${Object.keys(result.state.data.files || {}).length}`);
  return await prisma.message.create({
    data:{
      projectId:event.data.projectId,
      content:"I encountered an issue completing your React project. Let me try a different approach - please provide more specific requirements or try again.",
      role:"ASSISTANT",
      type:"ERROR",
    }
  })
}

  console.log(`✅ Elite React Agent success - Created ${Object.keys(result.state.data.files || {}).length} files`);
  return await prisma.message.create({
    data:{
      projectId:event.data.projectId,
      content:generateResponse(),
      role:"ASSISTANT",
      type:"RESULT",
      fragment:{
        create:{
          sandboxUrl:sandboxUrl,
          title:generateFragmentTitle(),
          files:result.state.data.files, 
        }
      }
    }
  })
})
 return { 
  url: sandboxUrl,
  title: generateFragmentTitle(),
  files: result.state.data.files,
  summary: result.state.data.summary,
  fileCount: Object.keys(result.state.data.files || {}).length,
  success: !isError
 };
},
);

