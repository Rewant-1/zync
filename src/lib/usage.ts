import { RateLimiterPrisma } from "rate-limiter-flexible";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// Credit allocation per plan
const PRO_POINTS = 100;   // Pro users get 100 generations/month
const FREE_POINTS = 5;    // Free users get 5 generations/month
const DURATION = 30 * 24 * 60 * 60; // 30 days in seconds
const GENERATION_COST = 1; // Each generation consumes 1 credit

/**
 * Creates a rate limiter instance based on user's plan
 * Pro access is currently disabled but structure is ready for billing integration
 */
export async function getUsageTracker(userId?: string) {
  let hasProAccess = false;
  
  if (userId) {
    // TODO: Implement actual pro plan checking when billing is added
    hasProAccess = false;
  } else {
    // Check for pro plan via Clerk (ready for future billing integration)
    const { has } = await auth();
    hasProAccess = has({ plan: "pro" });
  }

  // Create rate limiter with appropriate credit allocation
  const UsageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    points: hasProAccess ? PRO_POINTS : FREE_POINTS, 
    duration: DURATION, // 30-day rolling window
  });
  
  return UsageTracker;
}

/**
 * Consume credits for a generation request
 * Throws error if user has exceeded their limit
 */
export async function consumeCredits(userId?: string) {
  const actualUserId = userId || (await auth()).userId;
  if (!actualUserId) throw new Error("User not authenticated");
  
  const usageTracker = await getUsageTracker(actualUserId);
  
  // This will throw if user exceeds rate limit
  const result = await usageTracker.consume(actualUserId, GENERATION_COST);
  return result;
}

/**
 * Get current usage status for the user
 * Returns credits remaining, reset time, etc.
 */
export async function getUsageStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  
  const usageTracker = await getUsageTracker();
  const result = await usageTracker.get(userId);
  return result;
}
