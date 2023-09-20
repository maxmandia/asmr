import React from "react";
import Layout from "~/components/Layout";
import UserProfileImage from "~/components/UserProfileImage";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { ImageIcon } from "@radix-ui/react-icons";
export default function Page() {
  return (
    <div className="flex flex-col px-5 py-7">
      <div className="flex items-start justify-between ">
        <div className="flex items-center gap-3">
          <UserProfileImage />
          <button className="bg-input flex items-center gap-1 rounded-[6px] px-[10px] py-[5px]">
            <span className="text-[14px] font-medium">subscribers only</span>
            <ChevronDownIcon height={20} width={20} color="white" />
          </button>
        </div>
        <button className="bg-primary rounded-[6px] px-[20px] py-[10px] text-[14px] font-medium">
          post!
        </button>
      </div>
      <div className="py-5">
        <textarea
          className="max-h-[500px] min-h-[200px] w-full resize-none bg-transparent text-white focus:outline-none"
          placeholder="Share something :)"
        />
      </div>
      <div className="bg-input my-4 h-[1px] w-full" />
      <button className="bg-input flex w-fit items-center gap-1 rounded-[6px] px-[15px] py-[5px]">
        <ImageIcon height={20} width={20} color="white" />
        <span className="text-medium">upload media</span>
      </button>
    </div>
  );
}

Page.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
