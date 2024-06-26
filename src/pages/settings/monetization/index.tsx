import React, { useRef } from "react";
import Layout from "~/layouts/Layout";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { api } from "~/lib/utils/api";
import toast from "react-hot-toast";
function Monetization() {
  const router = useRouter();
  const priceRef = useRef<HTMLInputElement>(null);
  const { mutate } =
    api.subscriptionSettings.updateSubscriptionSettings.useMutation({
      onSuccess: () => {
        toast.dismiss();
        toast.success("Subscription settings updated successfully!");
      },
      onError: () => {
        toast.dismiss();
        toast.error("Something went wrong");
      },
    });

  function updateSubscriptionSettings() {
    if (!priceRef.current) {
      return;
    }
    toast.loading("Updating");
    mutate({
      price: Number(priceRef.current.value),
    });
  }

  return (
    <div className="p-5 md:w-[50%]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()}>
            <ChevronLeftIcon height={25} width={25} />
          </button>
          <span className="text-xl font-medium">Monetization</span>
        </div>
        <button onClick={updateSubscriptionSettings}>Save</button>
      </div>
      <div className="py-10">
        <span className="text-xl font-medium">Subscription Settings</span>
        <p className="text-[12px] text-grey md:text-[14px]">
          Manage your subscription settings for your audience.
        </p>
        <div className="flex flex-col py-5">
          <span>
            Subscription Price <span className="font-thin">(monthly)</span>
          </span>
          <div className="flex w-full items-center gap-1">
            <span>$</span>
            <input
              ref={priceRef}
              className="my-2 w-full max-w-[200px] rounded-[4px] bg-input px-2 py-1 outline-none"
              type="number"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Monetization;

Monetization.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
