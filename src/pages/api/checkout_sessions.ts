const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      try {
        let { priceId, userId } = req.body;

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
      } catch (err) {
        res.status(err.statusCode || 500).json(err.message);
      }
    case "GET":
      try {
        const session = await stripe.checkout.sessions.retrieve(
          req.query.session_id,
        );

        res.send({
          status: session.status,
          customer_email: session.customer_details.email,
        });
      } catch (err) {
        res.status(err.statusCode || 500).json(err.message);
      }
    default:
      res.setHeader("Allow", req.method);
      res.status(405).end("Method Not Allowed");
  }
}
