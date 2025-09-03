// Main tRPC router combining all sub-routers
import { createTRPCRouter } from '../init';
import { messagesRouter } from '@/modules/messages/server/procedures';
import { projectsRouter } from '@/modules/projects/server/procedures';
import { usageRouter } from '@/modules/usage/server/procedures';

export const appRouter = createTRPCRouter({
  // Chat messages & AI responses
  messages: messagesRouter,
  // Project CRUD operations
  projects: projectsRouter,
  // Credit tracking & rate limiting
  usage: usageRouter,
});

export type AppRouter = typeof appRouter;