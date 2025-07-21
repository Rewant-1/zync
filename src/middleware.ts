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

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  
  // Protect dashboard routes - redirect to home if not authenticated
  if (isDashboardRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  
  // Allow public routes
  if (!isPublicRoute(req) && !isDashboardRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL('/', req.url));
    }
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