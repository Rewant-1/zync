import { auth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

export const createTRPCContext = async (opts?: { req?: Request }) => {
  try {
    // If we have a request object, pass it to auth for proper context
    const authResult = opts?.req ? await auth() : await auth();
    return { auth: authResult };
  } catch (error) {
    // If auth fails (e.g., called outside request scope), return null auth
    console.warn('Auth called outside request scope:', error);
    return { auth: null };
  }
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
   transformer: superjson,
});
const isAuthed = t.middleware( ({ ctx, next }) => {
  if (!ctx.auth || !ctx.auth.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource.',
    });
  }
  return next({ ctx:{
    auth:ctx.auth,

  }});
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(isAuthed);