import React from "react";
import { Post } from "@prisma/client";
import Image from "next/image";
function UserPost(data: Post) {
  return <div>{/* <Image src={data.image} /> */}</div>;
}

export default UserPost;
