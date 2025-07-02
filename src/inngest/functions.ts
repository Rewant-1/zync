import {  inngest } from "./client";
import {  gemini, createAgent } from "@inngest/agent-kit";
import {Sandbox } from "@e2b/code-interpreter"
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
    const sandbox= await Sandbox.create("zync-test3")
    return sandbox.sandboxId
    });
    
    const summarizer = createAgent({
      name: "summarizer",
      system: "You are an expert summarizer.  You summarize in 2 words",
      model: gemini({ model: "gemini-2.0-flash" }),
    });

    const { output } = await summarizer.run(
  `Summarize the following text : ${event.data.value}`,
);
const sandboxUrl=await step.run("get-sandbox-url", async ()=> {
  const sandbox = await getSandbox(sandboxId);
  const host = sandbox.getHost(3000);
  return `http://${host}`;
})
 return {output : sandboxUrl} },
);

