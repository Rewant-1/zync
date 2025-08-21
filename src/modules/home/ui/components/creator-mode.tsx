"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Monitor,
  ShoppingCart,
  Users,
  Code2,
  Sparkles,
  ArrowUpIcon,
  Loader2Icon,
} from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

const APP_TYPES = [
  {
    id: "landing",
    label: "Landing Page",
    icon: Globe,
    description: "Marketing & promotional websites",
  },
  {
    id: "admin",
    label: "Admin Dashboard",
    icon: Monitor,
    description: "Control panels & analytics",
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    icon: ShoppingCart,
    description: "Online stores & marketplaces",
  },
  {
    id: "social",
    label: "Social Platform",
    icon: Users,
    description: "Community & networking apps",
  },
];

const TECH_STACKS = [
  {
    id: "react-modern",
    label: "Modern React",
    tech: "React + TypeScript + Tailwind",
    popular: true,
  },
  {
    id: "next-full",
    label: "Next.js Full-Stack",
    tech: "Next.js + Prisma + tRPC",
    popular: true,
  },
  {
    id: "vue-nuxt",
    label: "Vue Ecosystem",
    tech: "Vue 3 + Nuxt + Pinia",
    popular: false,
  },
  {
    id: "svelte",
    label: "Svelte Kit",
    tech: "SvelteKit + TypeScript",
    popular: false,
  },
];

const THEMES = [
  {
    id: "modern-dark",
    label: "Modern Dark",
    gradient: "from-slate-900 to-slate-800",
    accent: "#00fff0",
  },
  {
    id: "amber-gold",
    label: "Amber Gold",
    gradient: "from-amber-600 to-amber-800",
    accent: "#fbbf24",
  },
  {
    id: "ocean-blue",
    label: "Ocean Blue",
    gradient: "from-blue-900 to-cyan-800",
    accent: "#0ea5e9",
  },
  {
    id: "forest-green",
    label: "Forest Green",
    gradient: "from-green-900 to-emerald-800",
    accent: "#10b981",
  },
  {
    id: "sunset-orange",
    label: "Sunset Orange",
    gradient: "from-orange-900 to-red-800",
    accent: "#f97316",
  },
];

const THEME_ACCENT_CLASS: Record<string, string> = {
  "modern-dark": "bg-[#00fff0]",
  "amber-gold": "bg-[#fbbf24]",
  "ocean-blue": "bg-[#0ea5e9]",
  "forest-green": "bg-[#10b981]",
  "sunset-orange": "bg-[#f97316]",
};

const formSchema = z.object({
  projectName: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Name too long"),
  appType: z.string().min(1, "Please select an app type"),
  techStack: z.string().min(1, "Please select a tech stack"),
  description: z
    .string()
    .min(10, "Please provide more details")
    .max(1000, "Description too long"),
  theme: z.string().min(1, "Please select a theme"),
});

type FormData = z.infer<typeof formSchema>;

export const CreatorMode = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const router = useRouter();
  const trpc = useTRPC();
  const clerk = useClerk();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      appType: "",
      techStack: "",
      description: "",
      theme: "",
    },
    mode: "onChange",
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

  const enhancePrompt = useMutation(
    trpc.projects.enhancePrompt.mutationOptions()
  );

  const enhanceDescription = async () => {
    const { projectName, appType, techStack, description } = form.getValues();
    if (!description.trim() || !projectName || !appType || !techStack) return;

    setIsEnhancing(true);
    try {
      const result = await enhancePrompt.mutateAsync({
        projectName,
        appType,
        techStack,
        description,
      });
      if (result?.enhanced) {
        form.setValue("description", result.enhanced);
      }
      toast.success("Description enhanced with AI!");
    } catch {
      toast.error("Failed to enhance description");
    } finally {
      setIsEnhancing(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    const values = form.getValues();
    switch (currentStep) {
      case 1:
        return !!values.projectName.trim();
      case 2:
        return !!values.appType;
      case 3:
        return !!values.techStack;
      case 4:
        return !!values.description.trim() && values.description.length >= 10;
      case 5:
        return !!values.theme;
      default:
        return false;
    }
  };

  const onSubmit = async (values: FormData) => {
    const finalPrompt = `${values.description}\n\nProject Configuration:\n- Name: ${values.projectName}\n- Type: ${APP_TYPES.find((t) => t.id === values.appType)?.label}\n- Tech Stack: ${TECH_STACKS.find((t) => t.id === values.techStack)?.tech}\n- Theme: ${THEMES.find((t) => t.id === values.theme)?.label}`;

    try {
      await createProject.mutateAsync({
        value: finalPrompt,
      });
    } catch {}
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-white">
                What&apos;s your project name?
              </h3>
              <p className="text-neutral-400 text-lg">
                Give your project a memorable name
              </p>
            </div>
      <div className="space-y-4">
              <Label htmlFor="projectName" className="text-white text-lg">
                Project Name
              </Label>
              <Input
                id="projectName"
                {...form.register("projectName")}
                placeholder="e.g., My Awesome App"
        className="bg-transparent border border-[rgba(251,191,36,0.12)] text-white placeholder:text-neutral-500 rounded-2xl p-4 glass focus:border-[rgba(251,191,36,0.3)] transition-all"
              />
              {form.formState.errors.projectName && (
                <p className="text-red-400 text-sm">
                  {form.formState.errors.projectName.message}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white">
                What type of app?
              </h3>
              <p className="text-neutral-400">
                Choose the category that best fits your project
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {APP_TYPES.map((type) => (
                <Card
                  key={type.id}
                  className={cn(
                    "cursor-pointer transition-all duration-300 border border-[rgba(251,191,36,0.12)] bg-transparent hover:bg-[rgba(251,191,36,0.06)] rounded-2xl glass",
                    form.watch("appType") === type.id &&
                      "border-[#fbbf24] shadow-lg shadow-[#fbbf24]/10"
                  )}
                  onClick={() => form.setValue("appType", type.id)}
                >
                  <CardContent className="p-5 flex items-start gap-3">
                    <type.icon className="w-6 h-6 text-[#00fff0] mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">{type.label}</h4>
                      <p className="text-sm text-neutral-400">
                        {type.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white">
                Choose your tech stack
              </h3>
              <p className="text-neutral-400">
                Select the technologies you want to use
              </p>
            </div>
            <div className="space-y-3">
              {TECH_STACKS.map((stack) => (
                <Card
                  key={stack.id}
                  className={cn(
                    "cursor-pointer transition-all duration-300 border border-[rgba(251,191,36,0.12)] bg-transparent hover:bg-[rgba(251,191,36,0.06)] rounded-2xl glass",
                    form.watch("techStack") === stack.id &&
                      "border-[#fbbf24] shadow-lg shadow-[#00fff0]/10"
                  )}
                  onClick={() => form.setValue("techStack", stack.id)}
                >
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Code2 className="w-5 h-5 text-[#00fff0]" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white">
                            {stack.label}
                          </h4>
                          {stack.popular && (
                            <span className="px-2 py-1 text-xs bg-[#00fff0] text-black rounded-full font-medium">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-400">{stack.tech}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white">
                Describe your project
              </h3>
              <p className="text-neutral-400">Tell us what you want to build</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Project Description
                </Label>
        <div className="relative border border-[rgba(251,191,36,0.12)] rounded-2xl bg-transparent p-4 glass">
                  <TextareaAutosize
                    {...form.register("description")}
                    placeholder="Describe what you want to build, key features, design preferences..."
          className="w-full resize-none bg-transparent outline-none text-white placeholder:text-neutral-500 text-lg"
                    minRows={4}
                    maxRows={8}
                  />
                </div>
                {form.formState.errors.description && (
                  <p className="text-red-400 text-sm">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={enhanceDescription}
                disabled={isEnhancing || !form.watch("description")?.trim()}
                className="w-full text-black bg-gradient-to-r from-[#fbbf24] to-[#00fff0] hover:from-[#00fff0] hover:to-[#fbbf24] border-0 shadow-lg shadow-[#00fff0]/20 hover:shadow-[#fbbf24]/30 rounded-2xl"
              >
                {isEnhancing ? (
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Enhance with AI
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-white">Pick your theme</h3>
              <p className="text-neutral-400 text-lg">
                Choose a color scheme for your project
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {THEMES.map((theme) => (
                <Card
                  key={theme.id}
                  className={cn(
                    "cursor-pointer transition-all duration-300 border border-[rgba(251,191,36,0.12)] bg-transparent hover:bg-[rgba(251,191,36,0.06)] rounded-2xl p-6 glass",
                    form.watch("theme") === theme.id &&
                      "border-[#fbbf24] shadow-lg shadow-[#fbbf24]/10"
                  )}
                  onClick={() => form.setValue("theme", theme.id)}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div
                      className={cn(
                        "w-full h-16 rounded-lg bg-gradient-to-r",
                        theme.gradient
                      )}
                    />
                    <div>
                      <h4 className="font-semibold text-white text-lg">
                        {theme.label}
                      </h4>
                      <div
                        className={cn("w-4 h-4 rounded-full mx-auto mt-2", THEME_ACCENT_CLASS[theme.id])}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progressWidthClass = (
    [
      "w-[0%]",
      "w-[20%]",
      "w-[40%]",
      "w-[60%]",
      "w-[80%]",
      "w-[100%]",
    ][currentStep] || "w-[0%]"
  );

  return (
    <div className="space-y-10 p-8 max-w-4xl mx-auto w-full">
      <div className="w-full bg-[rgba(251,191,36,0.08)] rounded-full h-3">
        <div
          className={cn(
            "bg-gradient-to-r from-[#fbbf24] to-[#00fff0] h-3 rounded-full transition-all duration-500",
            progressWidthClass
          )}
        />
      </div>

      <div className="text-center">
        <span className="text-lg text-neutral-400">
          Step {currentStep} of 5
        </span>
      </div>

      <Card className="border border-[rgba(251,191,36,0.12)] bg-transparent min-h-[400px] rounded-2xl shadow-lg glass transition-all">
        <CardContent className="p-10">{renderStep()}</CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="text-neutral-400 hover:text-white text-lg"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>

        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                step === currentStep
                  ? "bg-[#fbbf24]"
                  : step < currentStep
                  ? "bg-[#00fff0]"
                  : "bg-[rgba(251,191,36,0.2)]"
              )}
            />
          ))}
        </div>

    {currentStep === 5 ? (
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={!canProceed() || createProject.isPending}
      className="bg-[#00fff0] text-black hover:bg-[#00fff0]/90 shadow-lg shadow-[#00fff0]/20 text-lg rounded-full px-6"
          >
            {createProject.isPending ? (
              <Loader2Icon className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <ArrowUpIcon className="w-5 h-5 mr-2" />
            )}
            Create Project
          </Button>
        ) : (
          <Button
            type="button"
            onClick={nextStep}
            disabled={!canProceed()}
      className="bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 text-lg rounded-full px-6 shadow-lg shadow-[#fbbf24]/10"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
