import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { resend } from "~/config/resend";
import MessageNotificationEmail from "~/components/MessageNotificationEmail";
import { logError } from "~/lib/helpers/log-error";

export const messagesRouter = createTRPCRouter({
  sendMessage: protectedProcedure
    .input(
      z.object({
        message: z.string().optional(),
        recipientId: z.string(),
        isTip: z.boolean(),
        tipPrice: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
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
            isTip: input.isTip,
            message: input.message,
            receiverId: input.recipientId,
            senderId: ctx.auth.userId,
            tipPrice: input.tipPrice,
          },
          select: {
            id: true,
            senderId: true,
            receiverId: true,
            createdAt: true,
            message: true,
            isTip: true,
            tipPrice: true,
            wasRead: true,
            wasNotified: true,
            sender: {
              select: {
                id: true,
                email: true,
                handle: true,
                profile_picture_url: true,
              },
            },
            receiver: {
              select: {
                id: true,
                email: true,
                handle: true,
              },
            },
          },
        });

        await resend.emails.send({
          from: "hi@messaging.hushasmr.com",
          to: recipient.email,
          subject: "New Message on Hush ASMR",
          react: MessageNotificationEmail({ message }) as any,
        });

        return message;
      } catch (error) {
        logError("messages", "failed to send a message", error as Error);
      }
    }),

  getMessages: protectedProcedure
    .input(
      z.object({
        handle: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          handle: input.handle,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const messages = await ctx.db.message.findMany({
        where: {
          OR: [
            {
              receiverId: user.id,
              senderId: ctx.auth.userId,
            },
            {
              receiverId: ctx.auth.userId,
              senderId: user.id,
            },
          ],
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      await ctx.db.message.updateMany({
        where: {
          receiverId: ctx.auth.userId,
          senderId: user.id,
          wasRead: false,
        },
        data: {
          wasRead: true,
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
      select: {
        id: true,
        handle: true,
        name: true,
        profile_picture_url: true,
        stripe_customer_id: true,
        subscriptionSetting: true,
      },
    });

    return users;
  }),
});
