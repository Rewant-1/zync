import {RateLimiterPrisma} from "rate-limiter-flexible";
import {prisma} from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
const PRO_POINTS = 100; // Points for pro users
const FREE_POINTS = 5;
const DURATION=30*24*60*60;
const GENERATION_COST = 1; // Cost per generation in points 
export async function getUsageTracker(){
    const{has} = await auth();
    const hasProAccess=has({plan:"pro"});
    const UsageTracker= new RateLimiterPrisma({
        storeClient:prisma,
        tableName:"Usage",
        points:hasProAccess ? PRO_POINTS : FREE_POINTS, // Points based on plan
        duration:DURATION, // 1 day 
})
    return UsageTracker;}
export async function consumeCredits(){
    const {userId}=await auth();
    if(!userId) throw new Error("User not authenticated");
    const usageTracker=await getUsageTracker();
    const result=await usageTracker.consume(userId, GENERATION_COST);
    return result;
};
export async function getUsageStatus(){
    const {userId}=await auth();
    if(!userId) throw new Error("User not authenticated");
    const usageTracker=await getUsageTracker();
    const result =await usageTracker.get(userId);
    return result;}
