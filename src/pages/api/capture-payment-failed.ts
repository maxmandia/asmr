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
    // TIP
    let idk = object;

    if (object?.metadata?.paymentType === "tip") {
      await prisma.message.delete({
        where: {
          id: Number(object.metadata.messageId),
        },
      });
      return resp.status(200).json({ status: "ok" });
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ status: "error" });
  }
}
