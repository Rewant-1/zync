"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


const Page =  () => {
  const [value,setvalue]=useState("");
  const trpc=useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: ()=>{
      toast.success("Background job started")}}));
    

  return (
    <div>
      <Input value={value} onChange={(e) => setvalue(e.target.value)} />
   <Button disabled={invoke.isPending} onClick={() => invoke.mutate({ value: value })}>
    Invoke Background job
   </Button>
    </div>
  );
}

export default Page;