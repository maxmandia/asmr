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
    const user = await prisma.user.findUnique({
      where: {
        id: object.metadata.userId,
      },
      select: {
        subscriptionSetting: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.subscriptionSetting.update({
      where: {
        userId: object.metadata.userId,
      },
      data: {
        isComplete: object.charges_enabled,
      },
    });

    return resp.status(200).json({ status: "ok" });
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ status: "error" });
  }
}
