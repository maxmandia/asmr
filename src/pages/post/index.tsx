import React, { useState } from "react";
import Layout from "~/components/Layout";
import UserProfileImage from "~/components/UserProfileImage";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { ImageIcon } from "@radix-ui/react-icons";
import { useUploadThing } from "~/lib/utils/uploadthing";
import { UploadFileResponse } from "uploadthing/client";
import { useAddTimelineData } from "~/hooks/useTimelineData";
import { useUser } from "@clerk/nextjs";
export default function Page() {
  const user = useUser();
  const { mutate } = useAddTimelineData();
  const [file, setFile] = useState<File[] | null>(null);
  const [caption, setCaption] = useState<string>("");
  const {
    startUpload,
    permittedFileInfo = {
      config: {
        video: {
          maxFileCount: 1,
          maxFileSize: "4GB",
        },
      },
    },
  } = useUploadThing("imageUploader", {
    onClientUploadComplete: (response: UploadFileResponse[] | undefined) => {
      console.log("upload complete");
    },
    onUploadError: () => {
      alert("error occurred while uploading");
    },
    onUploadBegin: () => {
      console.log("...uploading");
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
    if (!user?.user?.id) {
      console.log("no user id");
      return;
    }

    if (!file && caption === "") {
      console.log("no file or caption");
      return;
    }

    if (file) {
      let uploadResponse = await startUpload(file);
      console.log(uploadResponse);
    } else {
      mutate({
        userId: user.user.id,
        caption,
      });
    }
  }

  return (
    <div className="flex flex-col px-5 py-7 md:w-[60%]">
      <div className="flex items-start justify-between ">
        <div className="flex items-center gap-3">
          <UserProfileImage />
          <button className="flex items-center gap-1 rounded-[6px] bg-input px-[10px] py-[5px]">
            <span className="text-[14px] font-medium">subscribers only</span>
            <ChevronDownIcon height={20} width={20} color="white" />
          </button>
        </div>
        <button
          onClick={createPost}
          className="hover:bg-primary_hover rounded-[6px] bg-primary px-[20px] py-[10px] text-[14px] font-medium"
        >
          share!
        </button>
      </div>
      <div className="py-5">
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="max-h-[500px] min-h-[200px] w-full resize-none bg-transparent text-white focus:outline-none"
          placeholder="Share something :)"
        />
      </div>
      <div className="my-4 h-[1px] w-full bg-input" />
      <button
        onClick={openFileDialog}
        className="flex w-fit items-center gap-1 rounded-[6px] bg-input px-[15px] py-[5px]"
      >
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <ImageIcon height={20} width={20} color="white" />
        <span className="text-medium">upload media</span>
      </button>
    </div>
  );
}

Page.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
