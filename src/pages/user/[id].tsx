import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Layout from "~/components/Layout";
import { api } from "~/lib/utils/api";
import { LockClosedIcon, PersonIcon } from "@radix-ui/react-icons";
import UserPostsContainer from "~/components/UserPostsContainer";
function User() {
  const router = useRouter();
  const [tabSelected, setTabSelected] = useState<"home" | "videos">("home");
  const {
    data: postsData,
    isLoading: postsLoading,
    isError: postsError,
  } = api.posts.getPostsFromUser.useQuery({
    userId: router.query.id as string,
  });
  const {
    data: videoPostsData,
    isLoading: videoPostsLoading,
    isError: videoPostError,
  } = api.posts.getOnlyVideoPostsFromUser.useQuery({
    userId: router.query.id as string,
  });
  const { data, isLoading, isError } = api.users.findUserById.useQuery({
    id: router.query.id as string,
  });

  if (isLoading || postsLoading || videoPostsLoading) {
    return <span>...loading</span>;
  }

  if (isError || postsError || videoPostError) {
    return <span>...error</span>;
  }

  return (
    <div className="h-[calc(100vh_-_56px)] overflow-y-scroll md:w-[50%]">
      <div className="px-5">
        {data.profile_header_url ? (
          <div className="relative h-[125px] w-full bg-red-100 md:rounded-[12px]">
            <Image
              src={data.profile_header_url}
              alt={`${data.first_name}'s profile header`}
              layout="fill"
              objectFit="cover"
              priority={true}
              className="md:rounded-[12px]"
            />
          </div>
        ) : (
          <div className="h-[125px] w-full bg-primary md:rounded-[12px]" />
        )}
      </div>
      <div className="px-5">
        <div className="flex items-start gap-4  py-4">
          {data.profile_picture_url ? (
            <Image
              src={data.profile_picture_url}
              alt={`${data.first_name}'s profile picture`}
              width={70}
              height={70}
              priority={true}
              className="rounded-[100px] bg-white"
            />
          ) : (
            <div className="h-[70px] w-[70px] rounded-[100px] bg-white" />
          )}
          <div className="flex h-[70px] flex-col justify-between leading-none">
            <span className="text-[26px] font-medium">{data.first_name}</span>
            <span className="text-[16px] text-grey">@{data.handle}</span>
            <span className="text-[14px] text-grey">1.01M subscribers</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex w-full items-center justify-center gap-2 rounded-[100px] bg-white py-[4px] font-medium text-black hover:bg-white_hover">
            <PersonIcon />
            Follow
          </button>
          <button className="flex w-full items-center justify-center gap-2 rounded-[100px] bg-primary py-[4px] font-medium hover:bg-primary_hover">
            <LockClosedIcon />
            Subscribe
          </button>
        </div>
        <nav className="flex items-center gap-5 border-b-[.5px] border-grey pb-2 pt-4 font-medium">
          <button
            onClick={() => setTabSelected("home")}
            className={`${tabSelected === "home" ? "text-white" : "text-grey"}`}
          >
            Home
          </button>
          <button
            onClick={() => setTabSelected("videos")}
            className={`${
              tabSelected === "videos" ? "text-white" : "text-grey"
            }`}
          >
            Videos
          </button>
        </nav>
        <UserPostsContainer
          data={tabSelected === "home" ? postsData : videoPostsData}
        />
      </div>
    </div>
  );
}

export default User;

User.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
