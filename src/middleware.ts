import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  "/",
  '/sign-in(.*)',
  "/sign-up(.*)",
  "/api(.*)",
  "/#(.*)", // For landing page sections
])

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"])

// Helper function to check if user should be redirected due to lack of authentication
const shouldRedirectForAuth = (userId: string | null, req: Request): NextResponse | null => {
  if (!userId) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  return null;
};

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  
  // Protect dashboard routes - redirect to home if not authenticated
  if (isDashboardRoute(req)) {
    const redirectResponse = shouldRedirectForAuth(userId, req);
    if (redirectResponse) return redirectResponse;
  }
  
  // Protect non-public routes - redirect to home if not authenticated
  if (!isPublicRoute(req) && !isDashboardRoute(req)) {
    const redirectResponse = shouldRedirectForAuth(userId, req);
    if (redirectResponse) return redirectResponse;
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};