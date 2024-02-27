import type { NextApiRequest, NextApiResponse } from "next";
import posthog from "posthog-js";
import { prisma } from "~/config/prisma";
import { stripe } from "~/config/stripe";
import { sendPaymentEmail } from "~/lib/helpers/send-payment-email";
import { api } from "~/lib/utils/api";

export default async function handler(
  req: NextApiRequest,
  resp: NextApiResponse,
) {
  const {
    body: {
      data: { object },
    },
  } = req;

  try {
    // TIP
    if (object?.metadata?.paymentType === "tip") {
      posthog.capture("user_tip", {
        amount: object.amount / 100,
      });
      const recievingUser = await prisma.user.findUnique({
        where: {
          id: object.metadata.recieverId,
        },
      });

      if (!recievingUser) {
        return resp.status(200).json({ status: "ok" });
      }

      const emailResponse = await sendPaymentEmail(
        recievingUser?.email,
        "tip",
        object.amount / 100,
      );
      console.log(emailResponse);

      return resp.status(200).json({ status: "ok" });
    } else {
      // SUBSCRIPTION
      const invoice = await stripe.invoices.retrieve(object.invoice);
      posthog.capture("user_subscription", {
        amount: object.amount / 100,
      });
      if (
        !invoice.subscription_details?.metadata ||
        !invoice.subscription_details?.metadata.subscribedToId ||
        !invoice.subscription_details?.metadata.subscriberId
      ) {
        throw new Error("No metadata on invoice");
      }

      await prisma.subscription.create({
        data: {
          subscribedToId: invoice.subscription_details.metadata.subscribedToId,
          subscriberId: invoice.subscription_details.metadata.subscriberId,
        },
      });

      // check to see if the user is already following
      const isFollowing = await prisma.follow.findFirst({
        where: {
          followerId: invoice.subscription_details.metadata.subscriberId,
          followingId: invoice.subscription_details.metadata.subscribedToId,
        },
      });

      if (isFollowing) {
        return resp.status(200).json({ status: "ok" });
      }

      await prisma.follow.create({
        data: {
          followerId: invoice.subscription_details.metadata.subscriberId,
          followingId: invoice.subscription_details.metadata.subscribedToId,
        },
      });

      const recievingUser = await prisma.user.findUnique({
        where: {
          id: object.metadata.recieverId,
        },
      });

      if (!recievingUser) {
        return resp.status(200).json({ status: "ok" });
      }

      await sendPaymentEmail(
        recievingUser?.email,
        "subscription",
        object.amount / 100,
      );

      return resp.status(200).json({ status: "ok" });
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ status: "error" });
  }
}
