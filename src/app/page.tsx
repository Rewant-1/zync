"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";


const Page =  () => {
  const [value,setvalue]=useState("");
  const trpc=useTRPC();
  const {data:messages}=useQuery(trpc.messages.getMany.queryOptions());
  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: ()=>{
      toast.success("Message created")}}));
    

  return (
    <div>
      <Input value={value} onChange={(e) => setvalue(e.target.value)} />
   <Button disabled={createMessage.isPending} onClick={() => createMessage.mutate({ value: value })}>
    Invoke Background job
   </Button>
   {JSON.stringify(messages, null, 2)}
    </div>
  );
}

export default Page;