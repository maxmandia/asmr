import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/config/prisma";
import type { Post } from "@prisma/client";
import { logError } from "~/lib/helpers/log-error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const post: Post[] = await prisma.post.findMany();
    res.json(post);
  } catch (error: any) {
    logError("get-timeline", error.message, error);
  }
}
