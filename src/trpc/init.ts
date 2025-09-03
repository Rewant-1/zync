import { auth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

/**
 * Creates the tRPC context with user authentication state
 * This runs on every API request to establish who the user is
 */
export const createTRPCContext = async (opts?: { req?: Request }) => {
  try {
    // Get user auth state from Clerk - works for both server & client contexts
    const authResult = opts?.req ? await auth() : await auth();
    return { auth: authResult };
  } catch {
    // Gracefully handle auth failures (e.g., during sign-out transitions)
    return { auth: null };
  }
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// Initialize tRPC with our context type and superjson for Date/BigInt serialization
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

/**
 * Authentication middleware - ensures user is logged in
 * Used by protectedProcedure to guard sensitive operations
 */
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

// Export tRPC building blocks for use throughout the app
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);