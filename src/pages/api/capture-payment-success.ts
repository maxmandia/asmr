import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

export default async function handler(
  req: NextApiRequest,
  resp: NextApiResponse,
) {
  console.log(req);
  return resp.status(200).json({ status: "ok" });
}
