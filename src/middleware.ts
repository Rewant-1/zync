// Middleware for handling authentication with Clerk
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define which routes don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",                    // Landing page
  '/sign-in(.*)',        // Clerk sign-in pages
  "/sign-up(.*)",        // Clerk sign-up pages
  "/api(.*)",            // API routes (tRPC handles auth internally)
  "/#(.*)",              // Hash routes on landing page
])

// Dashboard and project pages require authentication
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"])

/**
 * Helper to redirect unauthenticated users to landing page
 */
const shouldRedirectForAuth = (userId: string | null, req: Request): NextResponse | null => {
  if (!userId) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  return null;
};

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  
  // Protect dashboard routes - redirect to landing if not authenticated
  if (isDashboardRoute(req)) {
    const redirectResponse = shouldRedirectForAuth(userId, req);
    if (redirectResponse) return redirectResponse;
  }
  
  // Protect any other non-public routes
  if (!isPublicRoute(req) && !isDashboardRoute(req)) {
    const redirectResponse = shouldRedirectForAuth(userId, req);
    if (redirectResponse) return redirectResponse;
  }
})

export const config = {
  matcher: [
    // Match all routes except Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    
    // Always run for API routes (tRPC)
    '/(api|trpc)(.*)',
  ],
};