import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16",
});

export const subscriptionSettingsRouter = createTRPCRouter({
  updateSubscriptionSettings: protectedProcedure
    .input(
      z.object({
        price: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userData = await ctx.db.user.findUnique({
          where: {
            id: ctx.auth.userId,
          },
          select: {
            handle: true,
            subscriptionSetting: true,
          },
        });

        if (!userData) {
          return new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        if (userData?.subscriptionSetting) {
          const product = await stripe.products.retrieve(
            userData.subscriptionSetting.productId,
          );

          const newPrice = await stripe.prices.create({
            product: product.id,
            unit_amount: Number(`${input.price}00`),
            currency: "usd",
            recurring: { interval: "month" },
          });

          await stripe.products.update(product.id, {
            default_price: newPrice.id,
          });

          const subscriptionSettings = await ctx.db.subscriptionSetting.update({
            where: {
              userId: ctx.auth.userId,
            },
            data: {
              price: input.price,
              priceId: newPrice.id,
              productId: product.id,
            },
          });

          return subscriptionSettings;
        } else {
          const product = await stripe.products.create({
            name: userData.handle,
            default_price_data: {
              currency: "usd",
              unit_amount: Number(`${input.price}00`),
              recurring: {
                interval: "month",
              },
            },
          });

          const subscriptionSettings = await ctx.db.subscriptionSetting.create({
            data: {
              userId: ctx.auth.userId,
              price: input.price,
              priceId: product.default_price as string,
              productId: product.id,
            },
          });

          return subscriptionSettings;
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
