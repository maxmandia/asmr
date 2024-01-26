import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const notificationsRouter = createTRPCRouter({
  getNotifications: protectedProcedure.query(async ({ ctx }) => {
    const notifications = await ctx.db.subscription.findMany({
      where: {
        subscribedToId: ctx.auth.userId,
      },
      include: {
        subscriber: {
          select: {
            profile_picture_url: true,
            handle: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notifications;
  }),
});
