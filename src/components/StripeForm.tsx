import { Cross1Icon } from "@radix-ui/react-icons";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
const URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
import { api } from "~/lib/utils/api";

export default function StripeForm({
  setShowPaymentModal,

  isTip = false,
}: {
  setShowPaymentModal: React.Dispatch<React.SetStateAction<boolean>>;
  isTip?: boolean;
}) {
  const elements = useElements();
  const stripe = useStripe();
  const utils = api.useContext();

  async function paymentHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
        redirect: "if_required",
      });

      if (isTip) {
        utils.messages.invalidate();
      } else {
        utils.posts.invalidate();
      }

      setShowPaymentModal(false);
      toast.success("Payment successful!");
    } catch (error: any) {
      toast.error(error);
    }
  }

  return (
    <form
      onSubmit={(e) => paymentHandler(e)}
      className="rounded-lg bg-input p-5"
    >
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
