"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { PROJECT_TEMPLATES } from "../../constants";
import { useClerk } from "@clerk/nextjs";

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Value is required" })
    .max(10000, { message: "Value is too long" }),
});
export const ProjectForm = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const clerk = useClerk();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
        queryClient.invalidateQueries(trpc.usage.status.queryOptions());
        router.push(`/projects/${data.id}`);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create project");
        if (error.data?.code === "UNAUTHORIZED") {
          clerk.openSignIn();
        }

        if (error.data?.code === "TOO_MANY_REQUESTS") {
          router.push("/pricing");
        }
      },
    })
  );
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createProject.mutateAsync({
        value: values.value,
      });
    } catch {
    }
  };
  const onSelect = (value: string) => {
    form.setValue("value", value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const [isFocused, setIsFocused] = useState(false);
  const isPending = createProject.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;

  return (
    <Form {...form}>
      <section className="space-y-8">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "relative border border-[rgba(185,106,255,0.12)] p-6 rounded-2xl glass transition-all duration-300",
            isFocused &&
              "border-[rgba(185,106,255,0.3)] shadow-lg shadow-[#b96aff]/10"
          )}
        >
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <TextareaAutosize
                {...field}
                disabled={isPending}
                placeholder="Describe what you'd like to build... (e.g., 'A modern e-commerce website with React and TypeScript')"
                className="w-full resize-none pt-2 bg-transparent outline-none text-white placeholder:text-neutral-500 text-lg"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                minRows={3}
                maxRows={8}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)(e);
                  }
                }}
              />
            )}
          />
          <div className="flex gap-x-4 items-center justify-between pt-4">
            <div className="text-sm text-neutral-500 font-mono"></div>
            <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 px-2 text-xs text-neutral-400 bg-[rgba(185,106,255,0.1)] rounded-md border border-[rgba(185,106,255,0.2)]">
              <span className="text-[#b96aff]">⌘</span>Enter to submit
            </kbd>
            <Button
              disabled={isButtonDisabled}
              className={cn(
                "size-10 rounded-full bg-[#00fff0] text-black hover:bg-[#00fff0]/90 transition-all duration-300 shadow-lg shadow-[#00fff0]/20",
                isButtonDisabled &&
                  "bg-neutral-600 text-neutral-400 shadow-none"
              )}
            >
              {isPending ? (
                <Loader2Icon className="animate-spin size-5" />
              ) : (
                <ArrowUpIcon className="size-5" />
              )}
            </Button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {PROJECT_TEMPLATES.map((template) => (
            <Button
              key={template.title}
              variant="outline"
              className="bg-[rgba(185,106,255,0.05)] border-[rgba(185,106,255,0.2)] text-white hover:bg-[rgba(185,106,255,0.1)] hover:border-[rgba(185,106,255,0.3)] transition-all duration-300"
              onClick={() => onSelect(template.prompt)}
            >
              {template.emoji} {template.title}
            </Button>
          ))}
        </div>
      </section>
    </Form>
  );
};
