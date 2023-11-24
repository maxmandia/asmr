import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const messagesRouter = createTRPCRouter({
  sendMessage: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        recipientId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const recipient = await ctx.db.user.findUnique({
        where: {
          id: input.recipientId,
        },
      });

      if (!recipient) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const message = await ctx.db.message.create({
        data: {
          message: input.message,
          receiverId: input.recipientId,
          senderId: ctx.auth.userId,
        },
      });

      return message;
    }),
});
