import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { stripe } from "~/config/stripe";
import { TRPCError } from "@trpc/server";

export const stripeRouter = createTRPCRouter({
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
        refresh_url: "https://hushasmr.com/sign-in",
        return_url: "https://hushasmr.com/home",
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
        refresh_url: "https://hushasmr.com/sign-in",
        return_url: "https://hushasmr.com/home",
        type: "account_onboarding",
      });

      return { url: accountLink.url };
    }
  }),
});
