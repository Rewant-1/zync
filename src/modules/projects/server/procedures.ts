import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { inngest } from "@/inngest/client";
import { generateSlug } from "random-word-slugs";
import { z } from "zod";
import { consumeCredits } from "@/lib/usage";
import { createAgent, gemini } from "@inngest/agent-kit";

export const projectsRouter = createTRPCRouter({
 
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId, // Security: user can only access their projects
        },
      });
      
      if (!existingProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return existingProject;
    }),

  /**
   * Get all projects for the current user
   * Ordered by most recently updated first
   */
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const projects = await prisma.project.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      orderBy: {
        updatedAt: "desc", // Most recent projects first
      },
    });
    return projects;
  }),

  /**
   * This is the main entry point for app creation:
   * 1. Consumes user credits
   * 2. Creates project with auto-generated name
   * 3. Saves initial user message
   * 4. Triggers Inngest function for AI generation
   */
  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Value is required" })
          .max(10000, { message: "Value is too long" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Step 1: Check and consume user credits
      try {
        await consumeCredits(ctx.auth.userId);
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Something went wrong",
          });
        } else {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "You have run out of credits",
          });
        }
      }

      //  Step 2: Create project with generated name and initial message
      const createdProject = await prisma.project.create({
        data: {
          userId: ctx.auth.userId,
          name: generateSlug(2, {
            format: "kebab", // e.g., "purple-elephant", "smart-robot"
          }),
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
            },
          },
        },
      });

      //  Step 3: Trigger AI code generation in background
      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: createdProject.id,
        },
      });
      
      return createdProject;
    }),

  /**
   * Enhance user prompts using AI for better generation results
   * Takes basic project info and expands it into a detailed specification
   * that the code generation agent can work with more effectively.
   */
  enhancePrompt: protectedProcedure
    .input(
      z.object({
        projectName: z.string().min(1),
        appType: z.string().min(1),
        techStack: z.string().min(1),
        description: z.string().min(10),
      })
    )
    .mutation(async ({ input }) => {
      // Use Gemini to enhance the user's description into a detailed brief
      const agent = createAgent({
        name: "prompt-enhancer",
        description:
          "Enhance a user description into a high quality generation brief",
        system:
          "You enhance user ideas into concise, structured briefs for a React app generator. Keep it actionable, 6-12 bullet points max, avoid boilerplate. Prefer clear requirements, UX details, features, constraints, and success criteria.",
        model: gemini({ model: "gemini-2.5-flash" }),
      });

      const content = `Project Name: ${input.projectName}\nApp Type: ${input.appType}\nTech Stack: ${input.techStack}\n\nUser Description:\n${input.description}\n\nReturn only the enhanced specification. Do not include headers like 'Enhanced:'`;
      const { output } = await agent.run(content);
      
      // Extract text from agent response
      let enhanced = "";
      try {
        if (output?.[0]?.type === "text") {
          const c = output[0].content as string | string[] | undefined;
          enhanced = Array.isArray(c) ? c.join(" ") : c ?? "";
        }
      } catch {}
      
      if (!enhanced) enhanced = input.description; // Fallback to original
      return { enhanced };
    }),
});
