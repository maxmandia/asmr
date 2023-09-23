import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { user_id, image, title, content } = req.body;
  console.log(user_id);
  res.json("success");
}
