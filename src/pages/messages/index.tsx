import { Cross1Icon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import Layout from "~/components/Layout";
import { api } from "~/lib/utils/api";
import Image from "next/image";
import debounce from "lodash.debounce";
import { User } from "~/types/User";

function Messages() {
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  return (
    <div className="h-full w-full p-5 md:flex md:items-center md:justify-between">
      {showNewMessageModal && (
        <NewMessageModal
          setSelectedUser={setSelectedUser}
          setShowNewMessageModal={setShowNewMessageModal}
        />
      )}
      <div className="h-full md:w-2/3 lg:w-1/3">
        <div className="flex items-center justify-between">
          <span>Messages</span>
          <button onClick={() => setShowNewMessageModal(true)}>New</button>
        </div>
        <div className="flex h-full items-start justify-center py-5">
          {selectedUser && <UserMessageCard user={selectedUser} />}
          {/* <span className="text-grey">No messages yet...</span> */}
        </div>
      </div>
      <div className="hidden md:block">
        <p className="text-grey">Message contents will show up here...</p>
      </div>
    </div>
  );
}

function NewMessageModal({
  setShowNewMessageModal,
  setSelectedUser,
}: {
  setShowNewMessageModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedUser: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: searchResults } = api.users.searchUsers.useQuery({
    query: searchTerm,
  });

  const debouncedSearch = debounce((query) => {
    setSearchTerm(query);
  }, 300);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    debouncedSearch(query);
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
      <div className="fixed h-screen w-screen bg-background p-5 md:h-fit md:w-3/12 md:rounded-[6px] md:p-10">
        <div className="flex w-full items-center gap-5">
          <button onClick={() => setShowNewMessageModal(false)}>
            <Cross1Icon height={18} width={18} />
          </button>
          <span className="text-[20px] font-medium">New Message</span>
        </div>
        <input
          onChange={handleSearch}
          className="my-4 w-full rounded-[6px] bg-input py-2 pl-2 focus:outline-none"
          type="text"
          placeholder="Search creators"
        />
        <div className="flex min-h-[300px] flex-col overflow-scroll">
          {searchResults?.map((creator, index) => (
            <UserMessageCard
              setShowNewMessageModal={setShowNewMessageModal}
              setSelectedUser={setSelectedUser}
              key={index}
              user={creator}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function UserMessageCard({
  user,
  setSelectedUser,
  setShowNewMessageModal,
}: {
  user: User;
  setSelectedUser?: React.Dispatch<React.SetStateAction<User>>;
  setShowNewMessageModal?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  if (!user) {
    return null;
  }

  return (
    <div
      onClick={() => {
        if (setShowNewMessageModal) {
          setShowNewMessageModal(false);
        }
        if (setSelectedUser) {
          setSelectedUser(user);
        }
      }}
      className="w-full"
    >
      <div className="flex items-center gap-5 rounded-[6px] py-2 pl-1 hover:cursor-pointer hover:bg-card_hover">
        {user.profile_picture_url ? (
          <div className="relative h-[45px] w-[45px] rounded-[100px] bg-red-100">
            <Image
              src={user.profile_picture_url}
              alt={`${user.first_name}'s profile header`}
              layout="fill"
              objectFit="cover"
              priority={true}
              className="rounded-[100px]"
            />
          </div>
        ) : (
          <div className="h-[45px] w-[45px] rounded-[45px] bg-primary" />
        )}
        <div className="flex flex-col">
          <span className="text-[18px] font-semibold">{user.first_name}</span>
          <span className="text-[14px] text-grey">@{user.handle}</span>
        </div>
      </div>
    </div>
  );
}

export default Messages;

Messages.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
