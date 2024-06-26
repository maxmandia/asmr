import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/router";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("Missing Stripe publishable key");
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

export default function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState("");
  const router = useRouter();
  const {
    priceId,
    subscriberId,
    subscribedToId,
    stripeCustomerId,
    connectAccountId,
  } = router.query;

  useEffect(() => {
    if (!priceId) {
      return;
    }

    fetch("/api/checkout_sessions", {
      method: "POST",
      body: JSON.stringify({
        priceId,
        subscriberId,
        subscribedToId,
        stripeCustomerId,
        connectAccountId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [priceId]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div id="checkout" className="w-[1000px]">
        {clientSecret && (
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        )}
      </div>
    </div>
  );
}
