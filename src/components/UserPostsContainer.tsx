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
        <div className="flex w-full flex-col gap-8">
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
