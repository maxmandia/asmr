import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { stripe } from "~/config/stripe";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

enum PaymentType {
  SUBSCRIPTION = "subscription",
  TIP = "tip",
}

export const stripeRouter = createTRPCRouter({
  getSubscriptionClientSecret: protectedProcedure
    .input(
      z.object({
        priceId: z.string(),
        customerId: z.string(),
        connectAccountId: z.string(),
        subscriberId: z.string(),
        subscribedToId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const {
          priceId,
          customerId,
          connectAccountId,
          subscriberId,
          subscribedToId,
        } = input;

        const subscription = await stripe.subscriptions.create({
          customer: customerId,
          application_fee_percent: 19,
          items: [
            {
              price: priceId,
            },
          ],
          payment_settings: {
            save_default_payment_method: "on_subscription",
          },
          payment_behavior: "default_incomplete",
          expand: ["latest_invoice.payment_intent"],
          on_behalf_of: connectAccountId,
          transfer_data: {
            destination: connectAccountId,
          },
          metadata: {
            paymentType: PaymentType.SUBSCRIPTION,
            subscriberId,
            subscribedToId,
          },
        });

        if (!subscription.latest_invoice) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Latest invoice is not available",
          });
        }
        return {
          clientSecret:
            //@ts-ignore
            subscription.latest_invoice.payment_intent.client_secret,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error,
        });
      }
    }),
  getTipClientSecret: protectedProcedure
    .input(
      z.object({
        price: z.number(),
        customerId: z.string(),
        connectAccountId: z.string(),
        creatorId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { price, customerId, connectAccountId, creatorId } = input;

        const paymentIntent = await stripe.paymentIntents.create({
          customer: customerId,
          setup_future_usage: "off_session",
          amount: price * 100,
          currency: "usd",
          automatic_payment_methods: {
            enabled: true,
          },
          application_fee_amount: Math.round(price * 100 * 0.19),
          on_behalf_of: connectAccountId,
          transfer_data: {
            destination: connectAccountId,
          },
          metadata: {
            paymentType: PaymentType.TIP,
            senderId: ctx.auth.userId,
            recieverId: creatorId,
          },
        });

        return {
          clientSecret: paymentIntent.client_secret,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error,
        });
      }
    }),

  createConnectAccount: protectedProcedure
    .input(
      z.object({
        countryCode: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // get the user's information
      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.auth.userId,
        },
        select: {
          subscriptionSetting: true,
          email: true,
          id: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (
        user.subscriptionSetting &&
        user.subscriptionSetting.connectAccountId
      ) {
        const accountLink = await stripe.accountLinks.create({
          account: user.subscriptionSetting.connectAccountId,
          refresh_url: `${URL}/sign-in`,
          return_url: `${URL}/home`,
          type: "account_onboarding",
        });
        return { url: accountLink.url };
      } else {
        // throw an error if the country code is not provided
        if (!input.countryCode) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Country code is required",
          });
        }
        // create a connect account
        const account = await stripe.accounts.create({
          type: "standard",
          email: user.email,
          metadata: {
            userId: user.id,
          },

          business_type: "individual",
          country: input.countryCode,
        });

        // save the account id to the user
        await ctx.db.subscriptionSetting.upsert({
          where: {
            userId: user.id,
          },
          update: {
            connectAccountId: account.id,
          },
          create: {
            userId: user.id,
            connectAccountId: account.id,
          },
        });

        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: `${URL}/sign-in`,
          return_url: `${URL}/home`,
          type: "account_onboarding",
        });

        return { url: accountLink.url };
      }
    }),

  hasUserCreatedConnectAccount: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        id: ctx.auth.userId,
      },
      select: {
        subscriptionSetting: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    console.log(user.subscriptionSetting);

    return {
      hasCreated: user.subscriptionSetting ? true : false,
    };
  }),
});
