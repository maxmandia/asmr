import type { NextApiRequest, NextApiResponse } from "next";
import type { IncomingHttpHeaders } from "http";
import { Webhook, WebhookRequiredHeaders } from "svix";
import { prisma } from "~/config/prisma";
import { logError } from "~/lib/helpers/log-error";
import { stripe } from "~/config/stripe";

type ResponseData = {
  message: string;
};

type EventType = "user.created" | "user.updated" | "user.deleted";

type Event = {
  data: Record<string, string | number> & {
    unsafe_metadata?: {
      username?: string;
    };
  };
  object: "event";
  type: EventType;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  try {
    const { headers } = req;
    const payload = await req.body;

    const heads = {
      "svix-id": headers["svix-id"],
      "svix-timestamp": headers["svix-timestamp"],
      "svix-signature": headers["svix-signature"],
    };

    if (!process.env.CLERK_WEBHOOK_SECRET) {
      const errorMsg = "CLERK_WEBHOOK_SECRET is not defined";
      await logError("/api/clerk-webhook", errorMsg);
      return res.status(500).json({ message: errorMsg });
    }

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const evt: Event | null = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & WebhookRequiredHeaders,
    ) as Event;

    if (!evt) {
      const errorMsg = "Failed to verify payload or evt is falsy.";
      await logError("/api/clerk-webhook", errorMsg);
      return res.status(400).json({ message: errorMsg });
    }

    const { data } = evt;

    switch (evt.type) {
      case "user.created":
        if (!data.email_addresses || !data.id) {
          const errorMsg = "Payload missing necessary fields.";
          await logError("/api/clerk-webhook", errorMsg);
          return res.status(400).json({ message: errorMsg });
        }

        //@ts-ignore
        const email_address = data.email_addresses[0].email_address;

        // create a stripe customer
        const stripeCustomer = await stripe.customers.create({
          metadata: {
            userId: data.id as string,
          },
        });

        const doesHandleExist = await prisma.user.findUnique({
          where: {
            handle:
              (data.username as string) ?? data?.unsafe_metadata?.username,
          },
        });

        if (doesHandleExist) {
          const errorMsg = "Handle already exists.";
          await logError("/api/clerk-webhook", errorMsg);
          return res.status(400).json({ message: errorMsg });
        }

        await prisma.user.create({
          data: {
            id: data.id.toString(),
            email: email_address,
            name: (data.username as string) ?? data?.unsafe_metadata?.username,
            handle:
              (data.username as string) ?? data?.unsafe_metadata?.username,
            profile_picture_url: (data.profile_image_url as string) ?? null,
            stripe_customer_id: stripeCustomer.id,
          },
        });

        return res.status(200).json({ message: "User created." });

      case "user.deleted":
        if (!data.id) {
          const errorMsg = "Payload missing necessary fields.";
          await logError("/api/clerk-webhook", errorMsg);
          return res.status(400).json({ message: errorMsg });
        }

        await prisma.user.delete({
          where: {
            id: data.id as string,
          },
        });

        return res.status(200).json({ message: "User deleted." });

      default:
        const errorMsg = `Unknown event type: ${evt.type}`;
        await logError("/api/clerk-webhook", errorMsg);
        return res.status(400).json({ message: errorMsg });
    }
  } catch (error: any) {
    await logError(
      "/api/clerk-webhook",
      error?.message ?? "Unexpected error occurred.",
      error,
    );
    return res
      .status(500)
      .json({ message: error?.message ?? "An unexpected error occurred." });
  }
}
