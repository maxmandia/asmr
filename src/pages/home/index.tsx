import Layout from "~/components/Layout";
import { api } from "~/lib/utils/api";
import UserPostsContainer from "~/components/UserPostsContainer";
import { useState } from "react";

export default function Home() {
  const [showFollowing, setShowFollowing] = useState(false);
  const { data, isLoading, isError } = api.posts.getAll.useQuery(undefined, {
    enabled: !showFollowing,
  });
  const {
    data: followingData,
    isLoading: followingIsLoading,
    isError: followingIsError,
  } = api.posts.getAllFollowingPosts.useQuery(undefined, {
    enabled: showFollowing,
  });

  return (
    <div className="flex h-[calc(100vh_-_56px)] flex-col px-5 md:w-[50%] md:p-0">
      <div className="flex w-full items-center justify-center gap-4 py-4">
        <button
          className={showFollowing ? "text-grey" : ""}
          onClick={() => setShowFollowing(false)}
        >
          For You
        </button>
        <button
          className={!showFollowing ? "text-grey" : ""}
          onClick={() => setShowFollowing(true)}
        >
          Following
        </button>
      </div>
      <div className="flex flex-grow overflow-y-auto py-8 pb-[50px] md:pb-[25px]">
        <UserPostsContainer
          data={showFollowing ? followingData ?? [] : data ?? []}
        />
      </div>
    </div>
  );
}

Home.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
