import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany();
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
          video: input.video,
          fileKey: input.fileKey,
          isPaid: input.isPaid,
        },
      });
      return post;
    }),
});
