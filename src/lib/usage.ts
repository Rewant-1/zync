import { RateLimiterPrisma } from "rate-limiter-flexible";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
const PRO_POINTS = 100; 
const FREE_POINTS = 5;
const DURATION = 30 * 24 * 60 * 60;
const GENERATION_COST = 1; 

export async function getUsageTracker(userId?: string) {
  let hasProAccess = false;
  if (userId) {
    hasProAccess = false;
  } else {
    const { has } = await auth();
    hasProAccess = has({ plan: "pro" });
  }

  const UsageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    points: hasProAccess ? PRO_POINTS : FREE_POINTS, 
    duration: DURATION, 
  });
  return UsageTracker;
}

export async function consumeCredits(userId?: string) {
  const actualUserId = userId || (await auth()).userId;
  if (!actualUserId) throw new Error("User not authenticated");
  const usageTracker = await getUsageTracker(actualUserId);
  const result = await usageTracker.consume(actualUserId, GENERATION_COST);
  return result;
}

export async function getUsageStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  const usageTracker = await getUsageTracker();
  const result = await usageTracker.get(userId);
  return result;
}
