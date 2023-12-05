import { Cross1Icon } from "@radix-ui/react-icons";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
const URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export default function StripeForm({
  setShowPaymentModal,
}: {
  setShowPaymentModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
