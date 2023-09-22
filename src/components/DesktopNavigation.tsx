import React from "react";
import {
  HomeIcon,
  ChatBubbleIcon,
  BellIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

function DesktopNavigation() {
  return (
    <div className="min-w-[200px]">
      <Link
        className="hover:bg-button_hover flex items-center gap-5 rounded-[12px] p-4"
        href={"/"}
      >
        <HomeIcon height={25} width={25} color="white" />
        <span>Home</span>
      </Link>
      <Link
        className="hover:bg-button_hover flex items-center gap-5 rounded-[12px] p-4"
        href={"/notifications"}
      >
        <BellIcon height={25} width={25} color="white" />
        <span>Notifications</span>
      </Link>
      <Link
        className="hover:bg-button_hover flex items-center gap-5 rounded-[12px] p-4"
        href={"/messages"}
      >
        <ChatBubbleIcon height={25} width={25} color="white" />
        <span>Messages</span>
      </Link>
      <Link
        className="hover:bg-button_hover flex items-center gap-5 rounded-[12px] p-4"
        href={"/"}
      >
        <HomeIcon height={25} width={25} color="white" />
        <span>Profile</span>
      </Link>
      <Link
        href={"/post"}
        className="hover:bg-primary_hover mt-5 flex w-full items-center justify-center gap-5 rounded-[100px] bg-primary p-2"
      >
        post
      </Link>
    </div>
  );
}

export default DesktopNavigation;
