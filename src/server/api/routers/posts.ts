import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  getPostsFromUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
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

      const posts = await ctx.db.post.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (ctx.auth.userId === input.userId) {
        return {
          user: { ...user, isMe: true },
          posts,
        };
      } else {
        return {
          user: { ...user, isMe: false },
          posts,
        };
      }
    }),
  getOnlyVideoPostsFromUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.post.findMany({
        where: {
          userId: input.userId,
          video: {
            not: null,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        caption: z.string(),
        video: z.string().optional(),
        image: z.string().optional(),
        fileKey: z.string().optional(),
        isPaid: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.create({
        data: {
          userId: ctx.auth.userId,
          caption: input.caption,
          image: input.image,
          video: input.video,
          fileKey: input.fileKey,
          isPaid: input.isPaid,
        },
      });
      return post;
    }),
});
