import { getUsageStatus } from "@/lib/usage";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const usageRouter = createTRPCRouter({
    status: protectedProcedure.query(async () => {
        try {
            return await getUsageStatus();
        } catch (err) {
            console.error("Failed to fetch usage status:", err);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Unable to fetch usage status",
                cause: err,
            });
        }
    }),
});