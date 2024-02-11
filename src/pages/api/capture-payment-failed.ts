import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/config/prisma";
import { logError } from "~/lib/helpers/log-error";

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
      await prisma.message.delete({
        where: {
          id: Number(object.metadata.messageId),
        },
      });

      return resp.status(200).json({ status: "ok" });
    }
  } catch (error: any) {
    await logError("capture-payment-failed", "failed to delete message", error);
    return resp.status(500).json({ status: "error" });
  }
}
