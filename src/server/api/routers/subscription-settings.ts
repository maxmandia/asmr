import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const subscriptionSettingsRouter = createTRPCRouter({
  updateSubscriptionSettings: protectedProcedure
    .input(
      z.object({
        price: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const subscriptionSettings = await ctx.db.subscriptionSetting.upsert({
          where: {
            userId: ctx.auth.userId,
          },
          update: {
            price: input.price,
          },
          create: {
            userId: ctx.auth.userId,
            price: input.price,
          },
        });

        return subscriptionSettings;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
