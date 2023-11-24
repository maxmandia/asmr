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
    // get the invoice on the payment intent object
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

    await prisma.follow.create({
      data: {
        followerId: invoice.subscription_details.metadata.subscriberId,
        followingId: invoice.subscription_details.metadata.subscribedToId,
      },
    });

    return resp.status(200).json({ status: "ok" });
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ status: "error" });
  }
}
