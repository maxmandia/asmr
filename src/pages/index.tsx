import { useUser } from "@clerk/nextjs";
import Layout from "~/components/Layout";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { UserButton, SignInButton } from "@clerk/nextjs";
import { api } from "~/lib/utils/api";
import UserPost from "~/components/UserPost";
import { Post } from "~/types/Post";
import { useState } from "react";
import ExpandedMedia from "~/components/ExpandedMedia";

export default function Home() {
  const user = useUser();
  const { data, isLoading } = api.posts.getAll.useQuery();
  const [expandedMediaContent, setExpandedMediaContent] = useState<Post | null>(
    null,
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="px-5 py-7 md:w-[50%] md:p-0 h-[calc(100vh_-_56px)] overflow-y-scroll">
      <div className="flex w-full items-center justify-between">
        <h2>[ASMR]</h2>
        <div className="flex items-center justify-center gap-2 md:gap-5">
          <MagnifyingGlassIcon height={25} width={25} color="white" />
          {user.isSignedIn ? (
            <UserButton afterSignOutUrl="/sign-in" />
          ) : (
            <SignInButton afterSignInUrl="/" />
          )}
        </div>
      </div>
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
    </div>
  );
}

Home.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
