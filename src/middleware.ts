import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  "/",
  '/sign-in(.*)',
  "/sign-up(.*)",
  "/api(.*)",
  "/#(.*)", 
])

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"])

const shouldRedirectForAuth = (userId: string | null, req: Request): NextResponse | null => {
  if (!userId) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  return null;
};

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  
  if (isDashboardRoute(req)) {
    const redirectResponse = shouldRedirectForAuth(userId, req);
    if (redirectResponse) return redirectResponse;
  }
  
  if (!isPublicRoute(req) && !isDashboardRoute(req)) {
    const redirectResponse = shouldRedirectForAuth(userId, req);
    if (redirectResponse) return redirectResponse;
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    
    '/(api|trpc)(.*)',
  ],
};