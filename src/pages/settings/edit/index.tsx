import React, { useState } from "react";
import Layout from "~/layouts/Layout";
import { useRouter } from "next/router";
import { ChevronLeftIcon, ImageIcon } from "@radix-ui/react-icons";
import { api } from "~/lib/utils/api";
import { useUploadThing } from "~/lib/utils/uploadthing";
import toast from "react-hot-toast";

function Edit() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [PFP, setPFP] = useState<File[] | null>(null);
  const [header, setHeader] = useState<File[] | null>(null);
  const { data: userData, isLoading, isError } = api.users.getUser.useQuery();
  const { mutate } = api.users.updateUserProfile.useMutation({});
  const utils = api.useContext();
  const { startUpload } = useUploadThing("imageUploader", {
    onUploadError: () => {
      toast.dismiss();
      toast.error("error occurred uploading file");
    },
    onUploadBegin: () => {
      toast.loading("...uploading");
    },
  });

  const openFileDialog = (id: string) => {
    const fileInput = document.getElementById(id) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handlePFPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const userFile = event.target.files[0];
    if (userFile) {
      setPFP([userFile]);
    }
  };

  const handleHeaderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const userFile = event.target.files[0];
    if (userFile) {
      setHeader([userFile]);
    }
  };

  async function handleProfileChanges() {
    if (!userData) {
      return;
    }

    try {
      if (name !== "" && name !== userData.name) {
        mutate({
          name: name,
        });
      }

      if (PFP !== null) {
        const uploadResponse = await startUpload(PFP);
        if (!uploadResponse) {
          return;
        }
        if (!uploadResponse || !uploadResponse[0]) {
          return;
        }
        mutate({
          profile_picture_url: uploadResponse[0].url,
        });
      }

      if (header !== null) {
        const uploadResponse = await startUpload(header);
        if (!uploadResponse) {
          return;
        }
        if (!uploadResponse || !uploadResponse[0]) {
          return;
        }
        mutate({
          profile_header_url: uploadResponse[0].url,
        });
      }
      utils.users.invalidate();
      toast.dismiss();
      toast.success("profile updated successfully!");
    } catch (error) {
      toast.dismiss();
      toast.error("error occurred updating profile");
    }
  }

  if (isError || isLoading || !userData) {
    return null;
  }

  return (
    <div className="p-5 md:w-[50%]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()}>
            <ChevronLeftIcon height={25} width={25} />
          </button>
          <span className="text-xl font-medium">Edit Profile</span>
        </div>
        <button
          disabled={
            (name !== "" && name !== userData.name) ||
            PFP !== null ||
            header !== null
              ? false
              : true
          }
          className={`${
            (name !== "" && name !== userData.name) ||
            PFP !== null ||
            header !== null
              ? "bg-primary"
              : ""
          } rounded-[6px] px-4 py-2`}
          onClick={handleProfileChanges}
        >
          Save
        </button>
      </div>
      <div className="py-10">
        <span className="text-xl font-medium">Profile details</span>
        <p className="text-[12px] text-grey md:text-[14px]">
          Update your name, profile picture and more.
        </p>
        <div className="flex flex-col gap-2 py-5">
          <div className="flex flex-col gap-2">
            <span>Name</span>
            <div className="flex w-full items-center gap-1">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full max-w-[200px] rounded-[4px] bg-input px-2 py-1 outline-none"
                type="text"
                placeholder={userData.name}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span>Profile picture</span>
            <button
              onClick={() => openFileDialog("fileInput")}
              className="flex w-fit items-center gap-1 rounded-[6px] bg-input px-[15px] py-[5px] hover:bg-input_hover"
            >
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handlePFPChange}
              />
              <ImageIcon height={15} width={15} color="white" />
              <span className="text-medium">upload profile picture</span>
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <span>Profile header</span>
            <button
              onClick={() => openFileDialog("fileInputHeader")}
              className="flex w-fit items-center gap-1 rounded-[6px] bg-input px-[15px] py-[5px] hover:bg-input_hover"
            >
              <input
                type="file"
                id="fileInputHeader"
                style={{ display: "none" }}
                onChange={handleHeaderChange}
              />
              <ImageIcon height={15} width={15} color="white" />
              <span className="text-medium">upload profile header</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Edit;

Edit.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
