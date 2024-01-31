import Link from "next/link";
import React, { useState } from "react";
import Layout from "~/components/Layout";
import { CaretRightIcon } from "@radix-ui/react-icons";
import { SignOutButton, useAuth } from "@clerk/nextjs";
import { api } from "~/lib/utils/api";
import { useRouter } from "next/router";
import posthog from "posthog-js";
import toast from "react-hot-toast";
import CountrySelector from "~/components/CountrySelector";
function Settings() {
  const { sessionId } = useAuth();
  const { data } = api.users.hasCompletedSubscriptionOnboarding.useQuery();
  const router = useRouter();
  const [showCountrySelector, setShowCountrySelector] = useState(false);

  const { refetch } = api.stripe.hasUserCreatedConnectAccount.useQuery(
    undefined,
    {
      enabled: false,
      onSuccess(data) {
        if (data.hasCreated) {
          toast.loading("Hang tight...");
          expressAccountMutation({});
        } else {
          setShowCountrySelector(true);
        }
      },
    },
  );
  const { mutate: expressAccountMutation } =
    api.stripe.createExpressAccount.useMutation({
      onMutate: () => {
        posthog.capture("creator_started_express_setup");
      },
      onSuccess: (resp) => {
        router.replace(resp.url);
      },
    });

  function expressMutationHelper(countryCode: string) {
    toast.loading("Hang tight...");
    expressAccountMutation({
      countryCode,
    });
  }

  if (!sessionId) {
    return null;
  }

  return (
    <div className="w-full p-5 md:w-[50%] md:p-1">
      {showCountrySelector && (
        <CountrySelector
          expressMutationHelper={expressMutationHelper}
          setShowCountrySelector={setShowCountrySelector}
        />
      )}
      <Link
        href={"/settings/edit"}
        className="flex w-full items-center justify-between rounded-[12px] p-3 hover:bg-card_hover"
      >
        <span>Edit profile</span>
        <CaretRightIcon height={20} width={20} />
      </Link>
      <button
        onClick={() => {
          if (data) {
            router.push("/settings/monetization");
          } else {
            refetch();
          }
        }}
        className="flex w-full items-center justify-between rounded-[12px] p-3 hover:bg-card_hover"
      >
        <span>Monetization</span>
        <CaretRightIcon height={20} width={20} />
      </button>
      <SignOutButton
        signOutOptions={{
          sessionId: sessionId,
        }}
      >
        <div className="flex w-full items-center justify-between rounded-[12px] p-3 hover:bg-card_hover">
          <span>Sign out</span>
          <CaretRightIcon height={20} width={20} />
        </div>
      </SignOutButton>
    </div>
  );
}

export default Settings;

Settings.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
