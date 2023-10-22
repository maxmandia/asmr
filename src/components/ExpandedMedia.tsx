import React from "react";
import Image from "next/image";
import { Post } from "~/types/Post";
import { ChevronLeftIcon } from "@radix-ui/react-icons";

interface Props {
  post: Post;
  setExpandedMediaContent: React.Dispatch<React.SetStateAction<Post | null>>;
}

function ExpandedMedia({ post, setExpandedMediaContent }: Props) {
  if (!post.image) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-[1000] bg-black">
      <div className="absolute top-0 z-[2000] px-5 py-10">
        <button onClick={() => setExpandedMediaContent(null)}>
          <ChevronLeftIcon height={25} width={25} color="white" />
        </button>
      </div>
      <Image src={post.image} objectFit="contain" layout="fill" alt="image" />
    </div>
  );
}

export default ExpandedMedia;
