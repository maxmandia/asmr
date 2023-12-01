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
import { Cross1Icon } from "@radix-ui/react-icons";

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
  setShowPaymentModal,
}: {
  customerId: string;
  priceId: string;
  connectAccountId: string;
  subscriberId: string;
  subscribedToId: string;
  setShowPaymentModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data, isLoading, isError } = api.stripe.getClientSecret.useQuery({
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
      <form onSubmit={paymentHandler} className="rounded-lg bg-input p-5">
        <div className="flex w-full items-end justify-end">
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowPaymentModal(false);
            }}
            className="rounded-md p-2 hover:bg-input_hover"
          >
            <Cross1Icon />
          </button>
        </div>
        <PaymentElement />
        <button className="my-4 w-full rounded-lg bg-primary py-2 hover:bg-primary_hover">
          Confirm
        </button>
      </form>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret: data.clientSecret,
    appearance: {
      theme: "night",
    },
  };

  if (isError || isLoading) {
    return <p>ee</p>;
  }

  return (
    <Overlay>
      <Elements
        key={data.clientSecret}
        stripe={stripePromise}
        options={options}
      >
        <StripeForm />
      </Elements>
    </Overlay>
  );
}

export default PaymentModal;
