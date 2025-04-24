import { db } from "@/db";
import { commentReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const commentReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(z.object({ commentId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { commentId } = input;
      const { id: userId } = ctx.user;
      const [existingCommentReactions] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.userId, userId),
            eq(commentReactions.type, "like")
          )
        );
      if (existingCommentReactions) {
        const [deletedCommentReactions] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.commentId, commentId),
              eq(commentReactions.userId, userId)
            )
          )
          .returning();
        return deletedCommentReactions;
      }
      const [createdCommentView] = await db
        .insert(commentReactions)
        .values({ userId, commentId, type: "like" })
        .onConflictDoUpdate({
          target: [commentReactions.commentId, commentReactions.userId],
          set: { type: "like" },
        })
        .returning();
      return createdCommentView;
    }),
  dislike: protectedProcedure
    .input(z.object({ commentId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { commentId } = input;
      const { id: userId } = ctx.user;
      const [existingCommentReactions] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.userId, userId),
            eq(commentReactions.type, "dislike")
          )
        );
      if (existingCommentReactions) {
        const [deletedCommentReactions] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.commentId, commentId),
              eq(commentReactions.userId, userId)
            )
          )
          .returning();
        return deletedCommentReactions;
      }
      const [createdCommentView] = await db
        .insert(commentReactions)
        .values({ userId, commentId, type: "dislike" })
        .onConflictDoUpdate({
          target: [commentReactions.commentId, commentReactions.userId],
          set: { type: "dislike" },
        })
        .returning();
      return createdCommentView;
    }),
});
