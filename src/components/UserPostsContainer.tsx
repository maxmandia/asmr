import React from "react";
import { Post } from "~/types/Post";
import UserPost from "./UserPost";
import { SubscribedUsers } from "~/types/SubscribedUsers";

interface Props {
  data: Post[];
  subscribedUsers: SubscribedUsers;
  setShowSubscriptionModal?: (value: boolean) => void;
}

function UserPostsContainer({
  data,
  subscribedUsers,
  setShowSubscriptionModal,
}: Props) {
  return (
    <>
      {data?.map((post) => (
        <UserPost
          key={post.id}
          post={post}
          subscribedUsers={subscribedUsers}
          isLast={data.indexOf(post) === data.length - 1}
          setShowSubscriptionModal={setShowSubscriptionModal ?? undefined}
        />
      ))}
    </>
  );
}

export default UserPostsContainer;
