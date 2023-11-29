import React from "react";
import Overlay from "./Overlay";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { api } from "~/lib/utils/api";
import toast from "react-hot-toast";

const URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

function PaymentModal({
  customerId,
  priceId,
  connectAccountId,
  subscriberId,
  subscribedToId,
}: {
  customerId: string;
  priceId: string;
  connectAccountId: string;
  subscriberId: string;
  subscribedToId: string;
}) {
  const { data } = api.stripe.getClientSecret.useQuery({
    priceId,
    customerId,
    connectAccountId,
    subscriberId,
    subscribedToId,
  });

  if (!data?.clientSecret) {
    return null;
  }

  function StripeForm() {
    const elements = useElements();
    const stripe = useStripe();

    async function paymentHandler() {
      try {
        if (!stripe || !elements) {
          throw new Error("Stripe isn't working right now");
        }

        await stripe.confirmPayment({
          //`Elements` instance that was used to create the Payment Element
          elements,
          confirmParams: {
            return_url: `${URL}/home`,
            save_payment_method: true,
          },
        });

        toast.success("Payment was made successfully");
      } catch (error: any) {
        toast.error(error);
      }
    }

    return (
      <form onSubmit={paymentHandler} className="rounded-lg bg-white p-5">
        <PaymentElement />
        <button className="my-4 w-full rounded-lg bg-primary py-2 hover:bg-primary_hover">
          Confirm
        </button>
      </form>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret: data.clientSecret,
  };

  return (
    <Overlay>
      <Elements stripe={stripePromise} options={options}>
        <StripeForm />
      </Elements>
    </Overlay>
  );
}

export default PaymentModal;
