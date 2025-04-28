import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const subscriptionsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ userId: z.string().uuid(), videoId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { userId, videoId } = input;
      if (userId === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const [subscription] = await db
        .insert(subscriptions)
        .values({ viewerId: ctx.user.id, creatorId: userId, videoId })
        .returning();
      return subscription;
    }),
  remove: protectedProcedure
    .input(z.object({ userId: z.string().uuid(), videoId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { userId, videoId } = input;
      if (userId === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const [deletedSubscription] = await db
        .delete(subscriptions)
        .where(
          and(
            eq(subscriptions.viewerId, ctx.user.id),
            eq(subscriptions.creatorId, userId),
            eq(subscriptions.videoId, videoId)
          )
        )
        .returning();
      return deletedSubscription;
    }),
});
