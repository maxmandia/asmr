import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/config/prisma";
import { logError } from "~/lib/helpers/log-error";
import type { Post } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId, caption, image, video }: Post = req.body;

  try {
    await prisma.post.create({
      data: {
        userId,
        caption,
        image,
        video,
      },
    });
    res.status(200);
  } catch (error: any) {
    logError("create-post", error.message, error);
  }
}
