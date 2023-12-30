import {
  ArrowLeftIcon,
  Cross1Icon,
  PaperPlaneIcon,
  PersonIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import React, { useEffect, useRef, useState } from "react";
import Layout from "~/components/Layout";
import { api } from "~/lib/utils/api";
import Image from "next/image";
import debounce from "lodash.debounce";
import { User } from "~/types/User";
import moment from "moment";
import { tipPrices } from "~/lib/data/tip-options";
import toast from "react-hot-toast";
import { Message } from "~/types/Message";
import useCurrentUser from "~/hooks/useCurrentUser";
import TipPaymentModal from "~/components/TipPaymentModal";

function Messages() {
  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isError: isErrorGettingCurrentUser,
  } = useCurrentUser();
  const utils = api.useContext();
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showTipMenu, setShowTipMenu] = useState(false);
  const [selectedTipPrice, setSelectedTipPrice] = useState<string>("");
  const [showPaymentElement, setShowPaymentElement] = useState(false);
  const { mutate } = api.messages.sendMessage.useMutation({
    onSuccess: () => {
      utils.messages.invalidate();
      if (inputRef?.current && inputRef.current.value) {
        inputRef.current.value = "";
      }
    },
  });
  const { data: conversations, isLoading: conversationsIsLoading } =
    api.messages.getMessagedUserIds.useQuery();
  const { data: messages } = api.messages.getMessages.useQuery(
    {
      recipientId: selectedUser?.id ?? "",
    },
    {
      enabled: selectedUser !== null,
    },
  );

  async function sendHandler() {
    if (
      inputRef === null ||
      inputRef.current === null ||
      selectedUser === null ||
      inputRef.current.value === ""
    ) {
      return;
    }

    mutate({
      recipientId: selectedUser.id,
      message: inputRef.current.value,
    });

    inputRef.current.value = "";
  }

  async function tipHandler(tipAmount: string) {
    if (selectedUser === null) {
      return toast.error("Please select a user to tip");
    }

    if (!selectedUser?.subscriptionSetting?.connectAccountId) {
      return toast.error("This user has not set up their Stripe account yet");
    }

    setSelectedTipPrice(tipAmount);
    setShowPaymentElement(true);
  }

  useEffect(() => {
    // when a new messages is recieved or sent, bring it into view
    lastMessageRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  if (isCurrentUserLoading || isErrorGettingCurrentUser || !currentUser) {
    return null;
  }

  return (
    <div className="fixed h-[92%] w-full py-5 md:static md:flex md:h-full md:items-center md:justify-between md:gap-5">
      {showNewMessageModal && (
        <NewMessageModal
          setSelectedUser={setSelectedUser}
          setShowNewMessageModal={setShowNewMessageModal}
        />
      )}
      {showPaymentElement &&
      selectedTipPrice &&
      selectedUser?.subscriptionSetting?.connectAccountId &&
      selectedUser?.subscriptionSetting?.priceId &&
      currentUser ? (
        <>
          <TipPaymentModal
            setShowPaymentModal={setShowPaymentElement}
            connectAccountId={
              selectedUser?.subscriptionSetting?.connectAccountId
            }
            customerId={currentUser?.stripe_customer_id}
            price={Number(selectedTipPrice)}
            subscribedToId={selectedUser?.id}
          />
        </>
      ) : null}
      <div
        className={`h-full px-5 md:w-2/3 lg:w-[50%] ${
          selectedUser && "hidden md:block"
        }`}
      >
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
          {selectedUser &&
            !conversations?.some((convo) => selectedUser.id === convo.id) && (
              <UserMessageCard user={selectedUser} />
            )}
          {conversationsIsLoading
            ? null
            : conversations && conversations.length > 0
            ? conversations?.map((conversation) => (
                <UserMessageCard
                  key={conversation.id}
                  user={conversation}
                  setSelectedUser={setSelectedUser}
                />
              ))
            : !selectedUser && (
                <div className="flex h-full flex-col items-center justify-center md:gap-1">
                  <div className="flex items-center">
                    <PersonIcon className="h-[25px] w-[25px] md:h-[30px] md:w-[30px]" />
                    <PersonIcon className="ml-[-12px] h-[25px] w-[25px] md:h-[30px] md:w-[30px]" />
                  </div>
                  <span className="text-medium text-[22px] md:text-[26px]">
                    No conversations yet
                  </span>
                  <p className="w-3/4 text-center text-[14px] text-grey md:text-[16px]">
                    Start a conversation with your favorite creator to get
                    started.
                  </p>
                </div>
              )}
        </div>
      </div>
      {selectedUser && (
        <div className="md:relative md:h-full md:w-full">
          <div className="flex items-center gap-3 px-5">
            <button onClick={() => setSelectedUser(null)} className="md:hidden">
              <ArrowLeftIcon height={24} width={24} />
            </button>
            <div className="flex items-center gap-2">
              {selectedUser.profile_picture_url ? (
                <div className="relative h-[40px] w-[40px] rounded-[100px]">
                  <Image
                    src={selectedUser.profile_picture_url}
                    alt={`${selectedUser.name}'s profile picture`}
                    layout="fill"
                    objectFit="cover"
                    priority={true}
                    className="rounded-[100px]"
                  />
                </div>
              ) : (
                <div className="h-[40px] w-[40px] rounded-[40px] bg-primary" />
              )}
              <span className="text-[20px] font-semibold">
                {selectedUser.name}
              </span>
            </div>
          </div>
          <div className="flex h-[80vh] flex-col gap-2 overflow-auto px-5 py-5 pb-10 md:pb-[50px]">
            {messages?.map((message, index) => {
              if (message.senderId !== currentUser.id) {
                if (message.isTip) {
                  return (
                    <UserTip
                      key={message.id}
                      message={message}
                      selectedUser={selectedUser}
                      fromCurrentUser={message.senderId === currentUser.id}
                    />
                  );
                } else
                  return (
                    <div
                      className="flex w-full flex-col"
                      key={message.id}
                      title={moment(message.createdAt).calendar().toString()}
                    >
                      <span className="w-fit rounded-t-full rounded-br-full bg-input px-4 py-1">
                        {message.message}
                      </span>
                      {index === messages.length - 1 && (
                        <span className="text-[12px] text-grey">
                          {moment(message.createdAt).fromNow()}
                        </span>
                      )}
                    </div>
                  );
              } else {
                if (message.isTip) {
                  return (
                    <UserTip
                      key={message.id}
                      message={message}
                      selectedUser={selectedUser}
                      fromCurrentUser={message.senderId === currentUser.id}
                    />
                  );
                } else
                  return (
                    <div
                      className="flex w-full flex-col items-end"
                      key={message.id}
                      title={moment(message.createdAt).calendar().toString()}
                    >
                      <span className="w-fit rounded-t-full rounded-bl-full bg-primary px-4 py-1">
                        {message.message}
                      </span>
                      {index === messages.length - 1 && (
                        <span className="text-[12px] text-grey">
                          {moment(message.createdAt).fromNow()}
                        </span>
                      )}
                    </div>
                  );
              }
            })}
            <div ref={lastMessageRef} />
          </div>
          <div className="absolute bottom-5 left-0 right-0 mx-3 flex flex-col items-start gap-[6px] md:bottom-0">
            {showTipMenu && (
              <div className="flex w-full items-center gap-2 overflow-auto py-2">
                {tipPrices.map((price) => {
                  return (
                    <button
                      onClick={() => tipHandler(price)}
                      key={price}
                      className="rounded-lg bg-input px-4 py-1 hover:bg-input_hover"
                    >
                      <span className="text-[15px] font-semibold">
                        ${price}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendHandler();
              }}
              className="flex w-full items-center justify-between rounded-[6px] bg-input p-3"
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex items-center gap-[6px] md:gap-2">
                  {/* <button title="upload an image">
                    <ImageIcon className="h-[18px] w-[18px] md:h-[22px] md:w-[22px]" />
                  </button> */}
                  <button
                    type="button"
                    onClick={() => setShowTipMenu((prev) => !prev)}
                    title="select tip amount"
                  >
                    <Image
                      width={16}
                      height={16}
                      className="h-[20px] w-[20px] md:h-[22px] md:w-[22px]"
                      src={"/coins.svg"}
                      alt="coins"
                    />
                  </button>
                </div>
                <input
                  ref={inputRef}
                  className="bg-input text-[18px] placeholder:text-[18px] focus:outline-none"
                  type="text"
                  placeholder="say hello!"
                />
              </div>
              <button type="submit" title="send message">
                <PaperPlaneIcon className="h-[18px] w-[18px] md:h-[22px] md:w-[22px]" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function UserTip({
  message,
  selectedUser,
  fromCurrentUser,
}: {
  message: Message;
  selectedUser: User;
  fromCurrentUser: boolean;
}) {
  return (
    <div className="my-1 flex w-full flex-col items-end">
      <div className="flex flex-col items-center rounded-lg bg-input px-5 py-3">
        <span className="text-[20px] font-semibold">${message.tipPrice}</span>
        <span className="w-[100px] text-center text-[12px] text-grey">
          {fromCurrentUser
            ? `You sent @${selectedUser.handle} a tip!`
            : `@${selectedUser.handle} sent you a tip!`}
        </span>
      </div>
    </div>
  );
}

function NewMessageModal({
  setShowNewMessageModal,
  setSelectedUser,
}: {
  setShowNewMessageModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
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
  setSelectedUser?: React.Dispatch<React.SetStateAction<User | null>>;
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

export default Messages;

Messages.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
