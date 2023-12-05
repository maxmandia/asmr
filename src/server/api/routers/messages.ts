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
          isTip: false,
          message: input.message,
          receiverId: input.recipientId,
          senderId: ctx.auth.userId,
        },
      });

      return message;
    }),

  getMessages: protectedProcedure
    .input(
      z.object({
        recipientId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db.message.findMany({
        where: {
          OR: [
            {
              receiverId: input.recipientId,
              senderId: ctx.auth.userId,
            },
            {
              receiverId: ctx.auth.userId,
              senderId: input.recipientId,
            },
          ],
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return messages;
    }),

  getMessagedUserIds: protectedProcedure.query(async ({ ctx }) => {
    // Query to fetch distinct user IDs
    const userIds = await ctx.db.message.findMany({
      where: {
        OR: [{ senderId: ctx.auth.userId }, { receiverId: ctx.auth.userId }],
      },
      distinct: ["senderId", "receiverId"],
      select: {
        senderId: true,
        receiverId: true,
      },
    });

    // Extract and filter unique user IDs
    const uniqueUserIds = new Set(
      userIds.flatMap((message) =>
        [message.senderId, message.receiverId].filter(
          (id) => id !== ctx.auth.userId,
        ),
      ),
    );

    // Fetch user details in a paginated manner if needed
    const users = await ctx.db.user.findMany({
      where: {
        id: { in: Array.from(uniqueUserIds) },
      },
      include: {
        subscriptionSetting: true,
      },
    });

    return users;
  }),
});
