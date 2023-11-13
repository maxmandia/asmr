import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

Stripe.PaymentIntentsResource;
export default async function handler(
  req: NextApiRequest,
  resp: NextApiResponse,
) {
  console.log("got ya");
  return resp.status(200).json({ status: "ok" });
}
