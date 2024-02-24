import { ArrowLeftIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import React, { useRef, useState } from "react";
import Layout from "~/layouts/Layout";
import { MessageseLayout } from "~/layouts/MessagesLayout";
import Link from "next/link";
import { api } from "~/lib/utils/api";
import { Message } from "~/types/Message";
import moment from "moment";
import Image from "next/image";
import { User } from "~/types/User";
import { useRouter } from "next/router";
import useCurrentUser from "~/hooks/useCurrentUser";
import { tipPrices } from "~/lib/data/tip-options";
import toast from "react-hot-toast";
import TipPaymentModal from "~/components/TipPaymentModal";

function MessageId() {
  const { query, push } = useRouter();
  const utils = api.useContext();
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showTipMenu, setShowTipMenu] = useState(false);
  const [messageId, setMessageId] = useState<number | null>(null);
  const [selectedTipPrice, setSelectedTipPrice] = useState("");
  const [showPaymentElement, setShowPaymentElement] = useState(false);
  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isError: isErrorGettingCurrentUser,
  } = useCurrentUser();
  const { data: messages } = api.messages.getMessages.useQuery({
    handle: query.handle as string,
  });
  const {
    data: selectedUser,
    isLoading: isSelectedUserLoading,
    isError: isSelectedUserErroring,
  } = api.users.getUserByHandle.useQuery({
    handle: query.handle as string,
  });

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

  async function sendHandler() {
    if (
      inputRef === null ||
      inputRef.current === null ||
      !selectedUser ||
      inputRef.current.value === "" ||
      !inputRef.current
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

  if (isSelectedUserErroring || isSelectedUserLoading) {
    return null;
  }

  if (isCurrentUserLoading || isErrorGettingCurrentUser || !currentUser) {
    return null;
  }

  return (
    <div className="md:relative md:h-full md:w-full">
      {showPaymentElement &&
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
      ) : null}
      <div className="flex items-center gap-3 px-5">
        <button
          onClick={() => {
            push("/messages");
          }}
          className="md:hidden"
        >
          <ArrowLeftIcon height={24} width={24} />
        </button>
        <Link
          href={`/${query.handle as string}`}
          className="flex items-center gap-2"
        >
          {selectedUser?.profile_picture_url ? (
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
          <span className="text-[20px] font-semibold">{selectedUser.name}</span>
        </Link>
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
                  <span className="text-[15px] font-semibold">${price}</span>
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
          <div className="flex w-full items-center gap-2 md:gap-3">
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
              className="w-full bg-input text-[18px] placeholder:text-[18px] focus:outline-none"
              type="text"
              placeholder="say hello!"
            />
          </div>
          <button type="submit" title="send message">
            <PaperPlaneIcon className="ml-4 h-[18px] w-[18px] md:h-[22px] md:w-[22px]" />
          </button>
        </form>
      </div>
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

export default MessageId;

MessageId.getLayout = function getLayout(page: JSX.Element) {
  return (
    <Layout>
      <MessageseLayout>{page}</MessageseLayout>
    </Layout>
  );
};
