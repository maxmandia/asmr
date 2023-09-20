import React from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

function UserProfileImage() {
  const user = useUser();

  if (!user.isSignedIn || !user?.user.hasImage) {
    return <div className="h-10 w-10 rounded-full bg-gray-200"></div>;
  }

  return (
    <Image
      width={40}
      height={40}
      className="rounded-[100px]"
      src={user?.user?.imageUrl}
      alt="PFP"
    />
  );
}

export default UserProfileImage;
