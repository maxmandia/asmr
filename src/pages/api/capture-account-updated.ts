import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/config/prisma";

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
    if (!object.payouts_enabled || !object.charges_enabled) {
      return resp.status(200).json({ status: "ignoring" });
    }

    await prisma.subscriptionSetting.update({
      where: {
        connectAccountId: object.id,
      },
      data: {
        isComplete: true,
      },
    });

    return resp.status(200).json({ status: "success" });
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ status: "error" });
  }
}
