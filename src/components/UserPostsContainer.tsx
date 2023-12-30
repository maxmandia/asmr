import React, { useState } from "react";
import { Post } from "~/types/Post";
import ExpandedMedia from "~/components/ExpandedMedia";
import UserPost from "./UserPost";
import { SubscribedUsers } from "~/types/SubscribedUsers";

interface Props {
  data: Post[];
  subscribedUsers: SubscribedUsers;
}

function UserPostsContainer({ data, subscribedUsers }: Props) {
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
              subscribedUsers={subscribedUsers}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default UserPostsContainer;
