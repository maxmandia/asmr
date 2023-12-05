import React, { useState } from "react";
import { Post } from "~/types/Post";
import ExpandedMedia from "~/components/ExpandedMedia";
import UserPost from "./UserPost";

interface Props {
  data: Post[];
}

function UserPostsContainer({ data }: Props) {
  const [expandedMediaContent, setExpandedMediaContent] = useState<Post | null>(
    null,
  );
  return (
    <>
      {expandedMediaContent ? (
        <ExpandedMedia
          setExpandedMediaContent={setExpandedMediaContent}
          post={expandedMediaContent}
        />
      ) : (
        <div className="flex flex-col gap-8 py-8 pb-[50px] md:pb-[25px]">
          {data?.map((post) => (
            <UserPost
              setExpandedMediaContent={setExpandedMediaContent}
              key={post.id}
              post={post}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default UserPostsContainer;
