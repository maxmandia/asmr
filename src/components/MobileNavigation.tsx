import React from "react";
import {
  HomeIcon,
  ChatBubbleIcon,
  BellIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import useCurrentUser from "~/hooks/useCurrentUser";

function MobileNavigation() {
  const { data: user } = useCurrentUser();

  return (
    <nav className="fixed bottom-0 z-50 flex w-screen items-center justify-around border-t-[.5px] border-solid bg-[#161617] py-1">
      <Link className="p-4" href={"/home"}>
        <HomeIcon height={25} width={25} color="white" />
      </Link>
      <Link className="p-4" href={"/messages"}>
        <ChatBubbleIcon height={25} width={25} color="white" />
      </Link>
      <Link className="p-4" href={"/post"}>
        <PlusCircledIcon height={25} width={25} color="white" />
      </Link>
      <Link className="p-4" href={"/notifications"}>
        <BellIcon height={25} width={25} color="white" />
      </Link>
      <Link className="p-4" href={`/${user?.handle}`}>
        <HomeIcon height={25} width={25} color="white" />
      </Link>
    </nav>
  );
}

export default MobileNavigation;
