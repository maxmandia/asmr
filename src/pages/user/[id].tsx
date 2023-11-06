import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import Layout from "~/components/Layout";
import { api } from "~/lib/utils/api";

function User() {
  const router = useRouter();
  const { data, isLoading, error } = api.users.findUserById.useQuery({
    id: router.query.id as string,
  });

  if (isLoading) {
    return <span>...loading</span>;
  }

  if (error) {
    return <span>{error.message}</span>;
  }

  return (
    <div>
      <div className="h-[150px] w-full bg-primary" />
      {data.profile_picture_url ? (
        <Image
          src={data.profile_picture_url}
          alt={`${data.first_name}'s profile picture`}
          width={80}
          height={80}
          priority={true}
          className="absolute left-6 top-[108px] rounded-[100px] bg-white"
        />
      ) : (
        <div className="absolute left-6 top-[108px] h-20 w-20 rounded-[100px] bg-white" />
      )}
      <span>{data.first_name}</span>
    </div>
  );
}

export default User;

User.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
