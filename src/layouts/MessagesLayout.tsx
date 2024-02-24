import { User } from "~/types/User";
import { Cross1Icon, PersonIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { api } from "~/lib/utils/api";
import Image from "next/image";
import useCurrentUser from "~/hooks/useCurrentUser";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import debounce from "lodash.debounce";

// components/MessagesLayout.tsx
export const MessageseLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isError: isErrorGettingCurrentUser,
  } = useCurrentUser();
  const utils = api.useContext();
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);

  const { data: conversations, isLoading: conversationsIsLoading } =
    api.messages.getMessagedUserIds.useQuery();
  return (
    <div className="fixed h-[92%] w-full py-5 md:static md:flex md:h-full md:items-center md:justify-between md:gap-5">
      {showNewMessageModal && (
        <NewMessageModal setShowNewMessageModal={setShowNewMessageModal} />
      )}
      {/* {showPaymentElement &&
      selectedTipPrice &&
      messageId &&
      selectedUser?.subscriptionSetting?.connectAccountId &&
      selectedUser?.subscriptionSetting?.priceId &&
      currentUser ? (
        <>
          <TipPaymentModal
            setShowPaymentModal={setShowPaymentElement}
            connectAccountId={
              selectedUser?.subscriptionSetting?.connectAccountId
            }
            messageId={messageId}
            customerId={currentUser?.stripe_customer_id}
            price={Number(selectedTipPrice)}
            subscribedToId={selectedUser?.id}
          />
        </>
      ) : null} */}
      <div className={`h-full px-5 md:w-2/3 lg:w-[50%]`}>
        <div className="flex items-center justify-between">
          <span>Messages</span>
          <button
            className="rounded-md p-2 hover:bg-input_hover"
            onClick={() => setShowNewMessageModal(true)}
          >
            <PlusCircledIcon />
          </button>
        </div>
        <div className="flex h-full w-full flex-col items-start justify-start py-3">
          {/* {selectedUser &&
            !conversations?.some((convo) => selectedUser.id === convo.id) && (
              <UserMessageCard user={selectedUser} />
            )} */}
          {conversationsIsLoading ? null : conversations &&
            conversations.length > 0 ? (
            conversations?.map((conversation) => (
              <UserMessageCard key={conversation.id} user={conversation} />
            ))
          ) : (
            <div className="flex h-full flex-col items-center justify-center md:gap-1">
              <div className="flex items-center">
                <PersonIcon className="h-[25px] w-[25px] md:h-[30px] md:w-[30px]" />
                <PersonIcon className="ml-[-12px] h-[25px] w-[25px] md:h-[30px] md:w-[30px]" />
              </div>
              <span className="text-medium text-[22px] md:text-[26px]">
                No conversations yet
              </span>
              <p className="w-3/4 text-center text-[14px] text-grey md:text-[16px]">
                Start a conversation with your favorite creator to get started.
              </p>
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

function NewMessageModal({
  setShowNewMessageModal,
}: {
  setShowNewMessageModal: React.Dispatch<React.SetStateAction<boolean>>;
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
      <div className="h-full w-screen bg-background p-5 md:h-fit md:w-3/12 md:rounded-[6px] md:p-10">
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

  setShowNewMessageModal,
}: {
  user: User;
  setShowNewMessageModal?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  if (!user) {
    return null;
  }

  return (
    <div
      onClick={() => {
        if (setShowNewMessageModal) {
          setShowNewMessageModal(false);
        }
        router.push(`/messages/${user.handle}`);
      }}
      className="w-full"
    >
      <div className="flex items-center gap-2 rounded-[6px] py-2 pl-1 hover:cursor-pointer hover:bg-card_hover">
        {user.profile_picture_url ? (
          <div className="relative h-[45px] w-[45px] rounded-[100px] bg-red-100">
            <Image
              src={user.profile_picture_url}
              alt={`${user.name}'s profile picture`}
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
          <span className="text-[18px] font-semibold">{user.name}</span>
          <span className="text-[14px] text-grey">@{user.handle}</span>
        </div>
      </div>
    </div>
  );
}
