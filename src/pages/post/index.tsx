import React, { useEffect, useState } from "react";
import Layout from "~/components/Layout";
import UserProfileImage from "~/components/UserProfileImage";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { ImageIcon } from "@radix-ui/react-icons";
import { useUploadThing } from "~/lib/utils/uploadthing";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { determineFileType } from "~/lib/helpers/determine-file-type";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { api } from "~/lib/utils/api";
import MuxUploader from "@mux/mux-uploader-react";
import axios from "axios";

export default function Page() {
  const router = useRouter();
  const user = useUser();
  const [canPost, setCanPost] = useState<boolean>(false);
  const [file, setFile] = useState<File[] | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const { data: uploadUrlData } = api.posts.getUploadUrl.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const { data: hasCompletedSubscriptionOnboarding } =
    api.users.hasCompletedSubscriptionOnboarding.useQuery();
  const { mutate } = api.posts.createPost.useMutation({
    onSuccess: () => {
      toast.dismiss();
      toast.success("post created");
      setTimeout(() => {
        toast.dismiss();
        router.push("/home");
      }, 1000);
    },
    onError: () => {
      toast.error("error occurred creating post");
    },
  });

  return (
    <div className="flex flex-col px-5 py-7 md:w-[60%]">
      <div className="flex items-start justify-between ">
        <div className="flex items-center gap-3">
          <UserProfileImage />
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="flex w-[155px]  items-center justify-between gap-1 rounded-[6px] bg-input px-[10px] py-[5px] text-center hover:bg-input_hover">
              <span className="text-[14px] font-medium">
                {isPaid ? "subscribers only" : "free"}
              </span>
              <ChevronDownIcon height={20} width={20} color="white" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="mt-2 w-[150px] rounded-[6px] bg-input">
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    onClick={() => setIsPaid(false)}
                    className="rounded-[6px] p-2 hover:bg-input_hover"
                  >
                    <span className="text-[14px] font-medium text-text">
                      free
                    </span>
                  </DropdownMenu.Item>
                  {hasCompletedSubscriptionOnboarding && (
                    <DropdownMenu.Item
                      onClick={() => setIsPaid(true)}
                      className="rounded-[6px] p-2 hover:bg-input_hover"
                    >
                      <span className="text-[14px] font-medium text-text">
                        subscribers only
                      </span>
                    </DropdownMenu.Item>
                  )}
                </DropdownMenu.Group>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
        <button
          disabled={!canPost}
          onClick={() => {
            if (!uploadUrlData?.uploadId) {
              return;
            }
            mutate({
              uploadId: uploadUrlData.uploadId,
              isPaid,
              caption: caption ?? null,
            });
          }}
          className={`rounded-[6px] bg-primary px-[20px] py-[10px] text-[14px] font-medium hover:bg-primary_hover ${
            !canPost && "opacity-50"
          }`}
        >
          create!
        </button>
      </div>
      <div className="py-5">
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="max-h-[500px] min-h-[200px] w-full resize-none bg-transparent text-white focus:outline-none"
          placeholder="*whispers* what's on your mind?"
        />
      </div>
      <div className="my-4 h-[1px] w-full bg-input" />
      <div>
        <MuxUploader
          onSuccess={(e) => {
            console.log(e);

            setCanPost(true);
          }}
          endpoint={uploadUrlData?.uploadUrl ?? ""}
        />
      </div>
    </div>
  );
}

Page.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
