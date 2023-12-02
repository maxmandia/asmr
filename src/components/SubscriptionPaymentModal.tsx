import React from "react";
import Overlay from "~/components/Overlay";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { api } from "~/lib/utils/api";
import StripeForm from "~/components/StripeForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

function SubscriptionPaymentModal({
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
  const {
    data: subscriptionData,
    isLoading,
    isError,
  } = api.stripe.getSubscriptionClientSecret.useQuery({
    priceId: priceId ?? "",
    customerId,
    connectAccountId,
    subscriberId,
    subscribedToId,
  });

  if (!subscriptionData?.clientSecret) {
    return null;
  }

  const options: StripeElementsOptions = {
    clientSecret: subscriptionData.clientSecret,
    appearance: {
      theme: "night",
    },
  };

  if (isError || isLoading) {
    return null;
  }

  return (
    <Overlay>
      <Elements
        key={subscriptionData.clientSecret}
        stripe={stripePromise}
        options={options}
      >
        <StripeForm setShowPaymentModal={setShowPaymentModal} />
      </Elements>
    </Overlay>
  );
}

export default SubscriptionPaymentModal;
