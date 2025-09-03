import { createTRPCRouter } from '../init';
import { messagesRouter } from '@/modules/messages/server/procedures';
import { projectsRouter } from '@/modules/projects/server/procedures';
import { usageRouter } from '@/modules/usage/server/procedures';

export const appRouter = createTRPCRouter({
  messages: messagesRouter,    // Chat messages & AI responses
  projects: projectsRouter,    // Project CRUD operations
  usage: usageRouter,          // Credit tracking & rate limiting
});

export type AppRouter = typeof appRouter;