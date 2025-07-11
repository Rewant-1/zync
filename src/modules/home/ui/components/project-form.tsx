"use client";

import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import {Form, FormField} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { PROJECT_TEMPLATES } from "../../constants";
import { useClerk } from "@clerk/nextjs";



const formSchema = z.object({
    value:z.string()
         .min(1,{message: "Value is required"})
        .max(10000, {message: "Value is too long"}),
})
export const ProjectForm = () => {
   const router=useRouter();
    const trpc=useTRPC();
    const clerk=useClerk();
    const queryClient = useQueryClient();
    
    // This can be a prop or state to control the visibility of usage
    const form=useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: "",
        },
    });

const createProject = useMutation(trpc.projects.create.mutationOptions({
    onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
        router.push(`/projects/${data.id}`);
    },
    onError: (error) => {
        toast.error(error.message || "Failed to create project");
        if(error.data?.code === "UNAUTHORIZED") {
            clerk.openSignIn();}
        
        
        
    },
}));
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await createProject.mutateAsync({
                value: values.value,
            });
        } catch (error) {
            // Error is already handled by mutation's onError
            console.error('Failed to create project:', error);
        }
    };
const onSelect=(value: string) => {
    form.setValue("value", value,{
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
});}


         const [isFocused, setIsFocused] = useState(false);
        const isPending = createProject.isPending;
        const isButtonDisabled = isPending || !form.formState.isValid;


    return(
        <Form {...form}>
            <section className="space-y-6">
            
            <form onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
            "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
        isFocused && "shadow-xs",)}> 
    
    <FormField
    control={form.control}
    name="value"
    render={({ field }) => (
        <TextareaAutosize
            {...field}
            disabled={isPending}
            placeholder="What would you like to build"
            className="w-full resize-none pt-4 bg-transparent outline-none "
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            minRows={2}
            maxRows={8}
            onKeyDown={(e)=> {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)(e);
                }}}
        />
    )}
    />
    <div className="flex gap-x-2 items-end justify-between pt-2">
        <div className="text-[10px] text-muted-foreground font-mono"></div>
    <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 px-1.5 text-[10px] text-muted-foreground">
        <span>&#8984;</span>Enter to submit
    </kbd>    </div>
    <Button
    disabled={isButtonDisabled} className={cn(
        "size-8 rounded-full",
        isButtonDisabled && "bg-muted-foreground border"
    )}>
     
     {isPending ? (<Loader2Icon className="animate-spin size-4" />) : <ArrowUpIcon className="size-4" />}
        
        
        
        <ArrowUpIcon/></Button>
    
    
    
    
    </form>    <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl ">
        {PROJECT_TEMPLATES.map((template)=>(
            <Button
                key={template.title}
                variant="outline"
                className="bg-white dark:bg-sidebar"
                onClick={()=>onSelect(template.prompt)}
            >
                {template.emoji}{template.title}
            </Button>
        ))}
        
        
        </div>
        </section></Form>
    );}