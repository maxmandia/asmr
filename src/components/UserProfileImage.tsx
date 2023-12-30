import React from "react";
import Image from "next/image";
import { api } from "~/lib/utils/api";

function UserProfileImage() {
  const { data, isLoading, isError } = api.users.getUser.useQuery();

  if (isLoading || isError) {
    return null;
  }

  if (!data?.profile_picture_url) {
    return (
      <div
        className="
        flex
        h-[40px]
        w-[40px]
        items-center
        justify-center
        rounded-[100px]
        bg-white
      "
      />
    );
  }

  return (
    <Image
      width={40}
      height={40}
      className="rounded-[100px]"
      src={data?.profile_picture_url}
      alt="PFP"
    />
  );
}

export default UserProfileImage;
