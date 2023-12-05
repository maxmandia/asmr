import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const followsRouter = createTRPCRouter({
  followUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const follow = await ctx.db.follow.create({
        data: {
          followerId: ctx.auth.userId,
          followingId: input.userId,
        },
      });

      return follow;
    }),

  unfollowUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const unfollow = await ctx.db.follow.delete({
        where: {
          followerId_followingId: {
            followerId: ctx.auth.userId,
            followingId: input.userId,
          },
        },
      });

      return unfollow;
    }),
});
