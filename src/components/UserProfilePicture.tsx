import React from "react";
import Image from "next/image";

function UserProfilePicture({
  profile_picture_url,
}: {
  profile_picture_url: string | null;
}) {
  if (!profile_picture_url) {
    return <div className="h-[30px] w-[30px] rounded-[30px] bg-primary" />;
  }

  return (
    <div className="relative h-[30px] w-[30px]">
      <Image
        priority={true}
        className="rounded-[200px]"
        layout="fill"
        objectFit="cover"
        src={profile_picture_url}
        alt={`user pfp`}
      />
    </div>
  );
}

export default UserProfilePicture;
