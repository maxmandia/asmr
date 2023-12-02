import React from "react";
import Overlay from "~/components/Overlay";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { api } from "~/lib/utils/api";
import StripeForm from "~/components/StripeForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

function TipPaymentModal({
  customerId,
  connectAccountId,
  subscribedToId,
  setShowPaymentModal,
  price,
}: {
  customerId: string;
  price: number;
  connectAccountId: string;
  subscribedToId: string;
  setShowPaymentModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    data: tipData,
    isLoading: tipIsLoading,
    isError: tipIsError,
  } = api.stripe.getTipClientSecret.useQuery({
    price: price ?? 0,
    customerId,
    connectAccountId,
    creatorId: subscribedToId,
  });

  if (!tipData?.clientSecret) {
    return null;
  }

  const options: StripeElementsOptions = {
    clientSecret: tipData.clientSecret,
    appearance: {
      theme: "night",
    },
  };

  if (tipIsError || tipIsLoading) {
    return null;
  }

  return (
    <Overlay>
      <Elements
        key={tipData.clientSecret}
        stripe={stripePromise}
        options={options}
      >
        <StripeForm setShowPaymentModal={setShowPaymentModal} />
      </Elements>
    </Overlay>
  );
}

export default TipPaymentModal;
