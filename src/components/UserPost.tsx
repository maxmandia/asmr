import React from "react";
import { RouterOutputs } from "~/lib/utils/api";
import Image from "next/image";

type Post = RouterOutputs["posts"]["getAll"][number];
interface Props {
  post: Post;
}

function UserPost(props: Props) {
  const { post } = props;

  return <div>{/* <Image src={post.user.} /> */}</div>;
}

export default UserPost;
