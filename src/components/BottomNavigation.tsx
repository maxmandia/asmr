import React from "react";
import {
  HomeIcon,
  ChatBubbleIcon,
  BellIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 flex w-screen items-center justify-around border-t-[.5px] border-solid py-4">
      <Link className="p-4" href={"/"}>
        <HomeIcon height={25} width={25} color="white" />
      </Link>
      <Link className="p-4" href={"/notifications"}>
        <BellIcon height={25} width={25} color="white" />
      </Link>
      <Link className="p-4" href={"/posts"}>
        <PlusCircledIcon height={25} width={25} color="white" />
      </Link>
      <Link className="p-4" href={"/messages"}>
        <ChatBubbleIcon height={25} width={25} color="white" />
      </Link>
      <Link className="p-4" href={"/"}>
        <HomeIcon height={25} width={25} color="white" />
      </Link>
    </nav>
  );
}

export default BottomNavigation;
