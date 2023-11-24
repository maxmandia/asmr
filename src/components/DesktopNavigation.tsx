import React from "react";
import {
  HomeIcon,
  ChatBubbleIcon,
  BellIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { api } from "~/lib/utils/api";

function DesktopNavigation() {
  const { data: user, isError, isLoading } = api.users.getUser.useQuery();

  if (isLoading) {
    return null;
  }

  if (isError) {
    return null;
  }

  return (
    <div className="min-w-[200px]">
      <Link
        className="flex items-center gap-5 rounded-[12px] p-4 hover:bg-card_hover"
        href={"/home"}
      >
        <HomeIcon height={25} width={25} color="white" />
        <span>Home</span>
      </Link>
      <Link
        className="flex items-center gap-5 rounded-[12px] p-4 hover:bg-card_hover"
        href={"/notifications"}
      >
        <BellIcon height={25} width={25} color="white" />
        <span>Notifications</span>
      </Link>
      <Link
        className="flex items-center gap-5 rounded-[12px] p-4 hover:bg-card_hover"
        href={"/messages"}
      >
        <ChatBubbleIcon height={25} width={25} color="white" />
        <span>Messages</span>
      </Link>
      <Link
        className="flex items-center gap-5 rounded-[12px] p-4 hover:bg-card_hover"
        href={`/${user.handle}`}
      >
        <HomeIcon height={25} width={25} color="white" />
        <span>Profile</span>
      </Link>
      <Link
        href={"/post"}
        className="mt-5 flex w-full items-center justify-center gap-5 rounded-[100px] bg-primary p-2 hover:bg-primary_hover"
      >
        post
      </Link>
    </div>
  );
}

export default DesktopNavigation;
