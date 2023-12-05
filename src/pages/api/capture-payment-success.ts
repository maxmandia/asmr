import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/config/prisma";
import { stripe } from "~/config/stripe";

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
      await prisma.message.create({
        data: {
          isTip: true,
          tipPrice: String(object.amount / 100),
          senderId: object.metadata.senderId,
          receiverId: object.metadata.recieverId,
        },
      });
      return resp.status(200).json({ status: "ok" });
    } else {
      // SUBSCRIPTION
      const invoice = await stripe.invoices.retrieve(object.invoice);

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

      return resp.status(200).json({ status: "ok" });
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ status: "error" });
  }
}
