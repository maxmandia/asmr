import React from "react";
import { Post } from "~/types/Post";
import UserPost from "./UserPost";
import { SubscribedUsers } from "~/types/SubscribedUsers";
import UserPostSkeleton from "./skeletons/UserPostSkeleton";

interface Props {
  data: Post[];
  subscribedUsers: SubscribedUsers;
  setShowSubscriptionModal?: (value: boolean) => void;
  isLoading: boolean;
}

function UserPostsContainer({
  data,
  subscribedUsers,
  setShowSubscriptionModal,
  isLoading,
}: Props) {
  return (
    <>
      {isLoading ? (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <UserPostSkeleton key={i} isLast={i === 2} />
          ))}
        </>
      ) : (
        data?.map((post) => (
          <UserPost
            key={post.id}
            post={post}
            subscribedUsers={subscribedUsers}
            isLast={data.indexOf(post) === data.length - 1}
            setShowSubscriptionModal={setShowSubscriptionModal ?? undefined}
          />
        ))
      )}
    </>
  );
}

export default UserPostsContainer;
