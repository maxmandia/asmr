import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { stripe } from "~/config/stripe";

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

        if (userData.subscriptionSetting?.productId) {
          // if the user has a product id, update the price
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
              userId: ctx.auth.userId,
              price: input.price,
              priceId: product.default_price as string,
              productId: product.id,
            },
          });

          return subscriptionSettings;
        } else {
          // if the user does not have a product id, create a product and price
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
