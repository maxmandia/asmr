import { useEffect, useRef } from "react";
import Overlay from "./Overlay";
import { RouterOutputs } from "~/lib/utils/api";

type ProfileData = RouterOutputs["posts"]["getPostsFromUser"]["user"];

interface Props {
  setShowSubscriptionModal: (value: boolean) => void;
  setShowPaymentElement: (value: boolean) => void;
  user: ProfileData;
}

export function SubscriptionModal({
  setShowSubscriptionModal,
  setShowPaymentElement,
  user,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setShowSubscriptionModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <Overlay>
      <div
        ref={modalRef}
        className="flex flex-col justify-center rounded-lg bg-input p-6"
      >
        <span className="text-center text-2xl">
          Subscribe to {user?.name} ✨
        </span>
        <p className="text-grey">
          The subscription cost is ${user.subscriptionSetting?.price}
          /month.
        </p>
        <button
          onClick={() => {
            setShowSubscriptionModal(false);
            setShowPaymentElement(true);
          }}
          className="mt-5 rounded-[4px] bg-primary py-1 hover:bg-primary_hover"
        >
          Subscribe
        </button>
      </div>
    </Overlay>
  );
}
