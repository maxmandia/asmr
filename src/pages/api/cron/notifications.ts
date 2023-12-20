import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/config/prisma";
import { resend } from "~/config/resend";
import NotificationEmail from "~/components/NotificationEmail";

export default async function handler(
  req: NextApiRequest,
  resp: NextApiResponse,
) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        wasRead: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            handle: true,
            profile_picture_url: true,
          },
        },
        receiver: {
          select: {
            id: true,
            email: true,
            handle: true,
          },
        },
      },
    });

    // get all notifications going to a given user
    const groupedByReceiver = messages.reduce(
      (acc, message) => {
        const receiverId = message.receiverId;

        if (!acc[receiverId]) {
          acc[receiverId] = [];
        }

        acc[receiverId]?.push(message);

        return acc;
      },
      {} as Record<string, typeof messages>,
    );

    // send out a single email notification to each user
    for (const reciever in groupedByReceiver) {
      const messages = groupedByReceiver[reciever];

      if (!messages) {
        continue;
      }

      // get all unique senders
      const uniqueSenders = messages.reduce((acc, message) => {
        const sender = message.sender;

        if (acc.has(sender.id)) {
          return acc;
        }

        acc.add(`@${sender.handle}`);

        return acc;
      }, new Set<string>());

      await resend.emails.send({
        from: "hi@messaging.hushasmr.com",
        to: [messages[0]?.receiver?.email ?? ""],
        subject: `You have ${messages.length} new message${
          messages.length > 1 ? "s" : ""
        }`,
        react: NotificationEmail({ messages, uniqueSenders }) as any,
      });

      for (const message of messages) {
        await prisma.message.update({
          where: {
            id: message.id,
          },
          data: {
            wasNotified: true,
          },
        });
      }
    }
    resp.status(200).json({ status: "ok" });
  } catch (error) {
    console.log(error);
  }
}
