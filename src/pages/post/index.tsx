import React, { useState } from "react";
import Layout from "~/components/Layout";
import UserProfileImage from "~/components/UserProfileImage";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { api } from "~/lib/utils/api";
import MuxUploader from "@mux/mux-uploader-react";
import Overlay from "~/components/Overlay";
import Spinner from "~/components/Spinner";

export default function Page() {
  const router = useRouter();
  const [isUploaded, setIsUploaded] = useState<boolean>(true);
  const [caption, setCaption] = useState<string>("");
  const [isPaid, setIsPaid] = useState<boolean>(false);

  // Getting the upload url from the server
  const { data: uploadUrlData } = api.posts.getUploadUrl.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  // Checking if the user has completed the subscription onboarding
  const { data: hasCompletedSubscriptionOnboarding } =
    api.users.hasCompletedSubscriptionOnboarding.useQuery();

  // Checking the status of the asset once it's uploaded
  api.posts.checkAssetStatus.useQuery(
    {
      isPaid,
      caption,
      uploadId: uploadUrlData?.uploadId,
    },
    {
      refetchOnWindowFocus: false,
      enabled: Boolean(isUploaded && uploadUrlData?.uploadId),
      onSuccess: (message) => {
        if (message === "success") {
          // the asset is ready for playback
          setIsUploaded(false);
          toast.success("post created successfully");
          router.push("/home");
        } else {
          // the asset isn't ready yet, continue polling
          return;
        }
      },
      onError: () => {
        toast.error("error creating post");
        setIsUploaded(false);
      },
      refetchInterval: 3000,
    },
  );

  return (
    <div className="flex flex-col px-5 py-7 md:w-[60%]">
      {isUploaded && (
        <>
          <Overlay>
            <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-input p-5 md:p-8">
              <span>Please wait until video is ready for playback.</span>
              <span className="text-grey">
                This should take less then 60 seconds.
              </span>
              <Spinner size={2} />
            </div>
          </Overlay>
        </>
      )}
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
            setIsUploaded(true);
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
