import Stripe from "stripe";
import { stripe } from "~/config/stripe";

export default async function handler(
  req: {
    method: any;
    body: { priceId: any; userId: any };
    headers: { origin: any };
    query: { session_id: string };
  },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: { error: string }): void; new (): any };
      end: { (arg0: string): void; new (): any };
    };
    send: (arg0: {
      clientSecret?: string | null;
      status?: Stripe.Checkout.Session.Status | null;
      customer_email?: string | null;
    }) => void;
    setHeader: (arg0: string, arg1: any) => void;
  },
) {
  switch (req.method) {
    case "POST":
      try {
        const { priceId, userId } = req.body;

        if (!priceId) {
          return res.status(400).json({ error: "Price ID is required" });
        }
        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
          ui_mode: "embedded",
          line_items: [
            {
              // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
              price: priceId,
              quantity: 1,
            },
          ],
          mode: "subscription",
          return_url: `${req.headers.origin}/user/${userId}`,
        });

        res.send({ clientSecret: session.client_secret });
      } catch (err: any) {
        res.status(err.statusCode || 500).json(err.message);
      }
    case "GET":
      try {
        const session = await stripe.checkout.sessions.retrieve(
          req.query.session_id,
        );

        res.send({
          status: session.status,
          customer_email: session?.customer_details?.email,
        });
      } catch (err: any) {
        res.status(err.statusCode || 500).json(err.message);
      }
    default:
      res.setHeader("Allow", req.method);
      res.status(405).end("Method Not Allowed");
  }
}
