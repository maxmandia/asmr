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
    return res.status(200).json({ message: "Post created successfully" });
  } catch (error: any) {
    logError("create-post", error.message, error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
