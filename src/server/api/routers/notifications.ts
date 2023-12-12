import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const notificationsRouter = createTRPCRouter({
  getNotifications: protectedProcedure.query(async ({ ctx }) => {
    const notifications = await ctx.db.subscription.findMany({
      where: {
        subscribedToId: ctx.auth.userId,
      },
      include: {
        subscriber: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notifications;
  }),
});
