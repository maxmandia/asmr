import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { stripe } from "~/config/stripe";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

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
            payment_method_types: ["card"],
          },
          payment_behavior: "default_incomplete",
          expand: ["latest_invoice.payment_intent"],
          transfer_data: {
            destination: connectAccountId,
          },

          metadata: {
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
          amount: price * 100,
          currency: "usd",
          payment_method_types: ["card"],
          application_fee_amount: 19,
          transfer_data: {
            destination: connectAccountId,
          },
          // metadata: {
          //   creatorId,
          // },
        });

        console.log(paymentIntent);

        return {
          clientSecret: paymentIntent.client_secret,
        };

        // const subscription = await stripe.subscriptions.create({
        //   customer: customerId,
        //   application_fee_percent: 19,
        //   items: [
        //     {
        //       price: priceId,
        //     },
        //   ],
        //   payment_settings: {
        //     save_default_payment_method: "on_subscription",
        //     payment_method_types: ["card"],
        //   },
        //   payment_behavior: "default_incomplete",
        //   expand: ["latest_invoice.payment_intent"],
        //   transfer_data: {
        //     destination: connectAccountId,
        //   },

        //   metadata: {
        //     subscriberId,
        //     subscribedToId,
        //   },
        // });

        // if (!subscription.latest_invoice) {
        //   throw new TRPCError({
        //     code: "INTERNAL_SERVER_ERROR",
        //     message: "Latest invoice is not available",
        //   });
        // }
        // return {
        //   clientSecret:
        //     //@ts-ignore
        //     subscription.latest_invoice.payment_intent.client_secret,
        // };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error,
        });
      }
    }),

  createExpressAccount: protectedProcedure.mutation(async ({ ctx }) => {
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

    if (user.subscriptionSetting && user.subscriptionSetting.connectAccountId) {
      const accountLink = await stripe.accountLinks.create({
        account: user.subscriptionSetting.connectAccountId,
        refresh_url: `${URL}/sign-in`,
        return_url: `${URL}/home`,
        type: "account_onboarding",
      });
      return { url: accountLink.url };
    } else {
      // create a connect account
      const account = await stripe.accounts.create({
        type: "express",
        email: user.email,
        metadata: {
          userId: user.id,
        },
        capabilities: {
          card_payments: {
            requested: true,
          },
          transfers: {
            requested: true,
          },
        },
        business_type: "individual",
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
});
