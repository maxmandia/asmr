import {
  ArrowLeftIcon,
  Cross1Icon,
  PaperPlaneIcon,
  PersonIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import React, { useEffect, useRef, useState } from "react";
import Layout from "~/layouts/Layout";
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
import Link from "next/link";
import { MessageseLayout } from "~/layouts/MessagesLayout";

function Messages({ children }: { children: React.ReactNode }) {
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
  const [messageId, setMessageId] = useState<number | null>(null);
  const [selectedTipPrice, setSelectedTipPrice] = useState("");
  const [showPaymentElement, setShowPaymentElement] = useState(false);
  const { mutate: sendMessage, mutateAsync: sendTipMessageAsync } =
    api.messages.sendMessage.useMutation({
      onSuccess: (data) => {
        if (!data.isTip) {
          utils.messages.invalidate();
        }
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

    sendMessage({
      recipientId: selectedUser.id,
      message: inputRef.current.value,
      isTip: false,
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

    const message = await sendTipMessageAsync({
      recipientId: selectedUser.id,
      isTip: true,
      tipPrice: tipAmount,
    });

    setSelectedTipPrice(tipAmount);
    setMessageId(message.id);
    setShowPaymentElement(true);
  }

  useEffect(() => {
    // when a new messages is recieved or sent, bring it into view
    lastMessageRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  if (isCurrentUserLoading || isErrorGettingCurrentUser || !currentUser) {
    return null;
  }

  return null;

  // (
  //   <div className="fixed h-[92%] w-full py-5 md:static md:flex md:h-full md:items-center md:justify-between md:gap-5">
  //     {showNewMessageModal && (
  //       <NewMessageModal
  //         setSelectedUser={setSelectedUser}
  //         setShowNewMessageModal={setShowNewMessageModal}
  //       />
  //     )}
  //     {showPaymentElement &&
  //     selectedTipPrice &&
  //     messageId &&
  //     selectedUser?.subscriptionSetting?.connectAccountId &&
  //     selectedUser?.subscriptionSetting?.priceId &&
  //     currentUser ? (
  //       <>
  //         <TipPaymentModal
  //           setShowPaymentModal={setShowPaymentElement}
  //           connectAccountId={
  //             selectedUser?.subscriptionSetting?.connectAccountId
  //           }
  //           messageId={messageId}
  //           customerId={currentUser?.stripe_customer_id}
  //           price={Number(selectedTipPrice)}
  //           subscribedToId={selectedUser?.id}
  //         />
  //       </>
  //     ) : null}
  //     <div
  //       className={`h-full px-5 md:w-2/3 lg:w-[50%] ${
  //         selectedUser && "hidden md:block"
  //       }`}
  //     >
  //       <div className="flex items-center justify-between">
  //         <span>Messages</span>
  //         <button
  //           className="rounded-md p-2 hover:bg-input_hover"
  //           onClick={() => setShowNewMessageModal(true)}
  //         >
  //           <PlusCircledIcon />
  //         </button>
  //       </div>
  //       <div className="flex h-full w-full flex-col items-start justify-start py-3">
  //         {selectedUser &&
  //           !conversations?.some((convo) => selectedUser.id === convo.id) && (
  //             <UserMessageCard user={selectedUser} />
  //           )}
  //         {conversationsIsLoading
  //           ? null
  //           : conversations && conversations.length > 0
  //           ? conversations?.map((conversation) => (
  //               <UserMessageCard
  //                 key={conversation.id}
  //                 user={conversation}
  //                 setSelectedUser={setSelectedUser}
  //               />
  //             ))
  //           : !selectedUser && (
  //               <div className="flex h-full flex-col items-center justify-center md:gap-1">
  //                 <div className="flex items-center">
  //                   <PersonIcon className="h-[25px] w-[25px] md:h-[30px] md:w-[30px]" />
  //                   <PersonIcon className="ml-[-12px] h-[25px] w-[25px] md:h-[30px] md:w-[30px]" />
  //                 </div>
  //                 <span className="text-medium text-[22px] md:text-[26px]">
  //                   No conversations yet
  //                 </span>
  //                 <p className="w-3/4 text-center text-[14px] text-grey md:text-[16px]">
  //                   Start a conversation with your favorite creator to get
  //                   started.
  //                 </p>
  //               </div>
  //             )}
  //       </div>
  //     </div>
  //     {children}
  //   </div>,
  // );
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
  return (
    <Layout>
      <MessageseLayout>{page}</MessageseLayout>
    </Layout>
  );
};
