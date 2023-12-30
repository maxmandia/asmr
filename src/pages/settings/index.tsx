import Link from "next/link";
import React from "react";
import Layout from "~/components/Layout";
import { CaretRightIcon } from "@radix-ui/react-icons";
import { SignOutButton, useAuth } from "@clerk/nextjs";

function Settings() {
  const { sessionId } = useAuth();

  if (!sessionId) {
    return null;
  }

  return (
    <div className="w-full p-5 md:w-[50%] md:p-1">
      <Link
        href={"/settings/edit"}
        className="flex w-full items-center justify-between rounded-[12px] p-3 hover:bg-card_hover"
      >
        <span>Edit profile</span>
        <CaretRightIcon height={20} width={20} />
      </Link>
      <Link
        href={"/settings/monetization"}
        className="flex w-full items-center justify-between rounded-[12px] p-3 hover:bg-card_hover"
      >
        <span>Monetization</span>
        <CaretRightIcon height={20} width={20} />
      </Link>
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
