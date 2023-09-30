import React from "react";
import { Post } from "@prisma/client";
import Image from "next/image";
import { api } from "~/lib/utils/api";

function UserPost() {
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return <div>{/* <Image src={data.image} /> */}</div>;
}

export default UserPost;
