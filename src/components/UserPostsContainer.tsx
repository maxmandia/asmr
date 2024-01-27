import React from "react";
import { Post } from "~/types/Post";
import UserPost from "./UserPost";
import { SubscribedUsers } from "~/types/SubscribedUsers";

interface Props {
  data: Post[];
  subscribedUsers: SubscribedUsers;
}

function UserPostsContainer({ data, subscribedUsers }: Props) {
  return (
    // <div className="flex h-full w-full flex-col gap-8">
    <>
      {data?.map((post) => (
        <UserPost
          key={post.id}
          post={post}
          subscribedUsers={subscribedUsers}
          isLast={data.indexOf(post) === data.length - 1}
        />
      ))}
    </>
    // </div>
  );
}

export default UserPostsContainer;
