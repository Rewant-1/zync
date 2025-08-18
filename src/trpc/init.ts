import { auth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

export const createTRPCContext = async (opts?: { req?: Request }) => {
  try {
    const authResult = opts?.req ? await auth() : await auth();
    return { auth: authResult };
  } catch {
    return { auth: null };
  }
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.auth || !ctx.auth.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource.',
    });
  }
  return next({ 
    ctx: {
      auth: ctx.auth,
    }
  });
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);