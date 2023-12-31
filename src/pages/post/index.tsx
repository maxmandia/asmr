import React, { useState } from "react";
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

export default function Page() {
  const router = useRouter();
  const user = useUser();
  const [file, setFile] = useState<File[] | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const { data: hasCompletedSubscriptionOnboarding } =
    api.users.hasCompletedSubscriptionOnboarding.useQuery();
  const { mutate } = api.posts.create.useMutation({
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

  const { startUpload } = useUploadThing("imageUploader", {
    onUploadError: () => {
      toast.dismiss();
      toast.error("error occurred uploading file");
    },
    onUploadBegin: () => {
      toast.loading("...uploading");
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const userFile = event.target.files[0];
    if (userFile) {
      setFile([userFile]);
    }
  };

  const openFileDialog = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  async function createPost() {
    // Check if user exists
    if (!user?.user?.id) {
      return;
    }

    // Check if either a file or a caption exists
    if (!file && caption === "") {
      return;
    }

    // If file exists, try to upload and determine its type
    if (file) {
      const fileType = determineFileType(file[0]!.name);
      if (!fileType) {
        toast.dismiss();
        toast.error("bad file type");
        return;
      }

      const uploadResponse = await startUpload(file);

      if (!uploadResponse) {
        return;
      }

      // If upload fails, return early
      if (!uploadResponse || !uploadResponse[0]) {
        return;
      }

      // Based on the file type, mutate accordingly
      if (fileType === "video") {
        mutate({
          caption,
          video: uploadResponse[0].url,
          fileKey: uploadResponse[0].key,
          isPaid,
        });
        return;
      }

      if (fileType === "image") {
        mutate({
          caption,
          image: uploadResponse[0].url,
          fileKey: uploadResponse[0].key,
          isPaid,
        });
        return;
      }
    }

    // If there is no file but a caption exists, proceed with only the caption
    mutate({
      caption,
      isPaid,
    });
  }

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
          onClick={createPost}
          className="rounded-[6px] bg-primary px-[20px] py-[10px] text-[14px] font-medium hover:bg-primary_hover"
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
      <button
        onClick={openFileDialog}
        className="flex w-fit items-center gap-1 rounded-[6px] bg-input px-[15px] py-[5px] hover:bg-input_hover"
      >
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <ImageIcon height={15} width={15} color="white" />
        <span className="text-medium">upload media</span>
      </button>
    </div>
  );
}

Page.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
