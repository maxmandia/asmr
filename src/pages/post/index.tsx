import React, { useState } from "react";
import Layout from "~/components/Layout";
import UserProfileImage from "~/components/UserProfileImage";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { ImageIcon } from "@radix-ui/react-icons";
import { useUploadThing } from "~/lib/utils/uploadthing";
import { UploadFileResponse } from "uploadthing/client";
import { useAddTimelineData } from "~/hooks/useTimelineData";
import { useUser } from "@clerk/nextjs";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { determineFileType } from "~/lib/helpers/determine-file-type";
export default function Page() {
  const router = useRouter();
  const user = useUser();
  const [file, setFile] = useState<File[] | null>(null);
  const [caption, setCaption] = useState<string>("");
  const { mutate } = useAddTimelineData(
    () => {
      toast.dismiss();
      toast.success("post created");
      setTimeout(() => {
        toast.dismiss();
        router.push("/");
      }, 1000);
    },
    () => toast.error("error occurred creating post"),
  );
  const { startUpload } = useUploadThing("imageUploader", {
    onUploadError: (error) => {
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
      const uploadResponse = await startUpload(file);

      // If upload fails, return early
      if (!uploadResponse || !uploadResponse[0]) {
        return;
      }

      // Determine the file type (the function should now return the type)
      const fileType = determineFileType(uploadResponse[0].name);

      // Based on the file type, mutate accordingly
      if (fileType === "video") {
        mutate({
          userId: user.user.id,
          caption,
          video: uploadResponse[0].url,
        });
        return;
      }

      if (fileType === "image") {
        mutate({
          userId: user.user.id,
          caption,
          image: uploadResponse[0].url,
        });
        return;
      }
    }

    // If there is no file but a caption exists, proceed with only the caption
    mutate({
      userId: user.user.id,
      caption,
    });
  }

  return (
    <div className="flex flex-col px-5 py-7 md:w-[60%]">
      <Toaster />
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
