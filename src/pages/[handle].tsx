import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Layout from "~/components/Layout";
import { api } from "~/lib/utils/api";
import {
  LockClosedIcon,
  PersonIcon,
  Share2Icon,
  GearIcon,
} from "@radix-ui/react-icons";
import UserPostsContainer from "~/components/UserPostsContainer";
import toast from "react-hot-toast";
import Link from "next/link";
import Overlay from "~/components/Overlay";
import SubscriptionPaymentModal from "~/components/SubscriptionPaymentModal";

function User() {
  const router = useRouter();
  const utils = api.useContext();
  const [tabSelected, setTabSelected] = useState<"home" | "videos">("home");
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showPaymentElement, setShowPaymentElement] = useState(false);
  const {
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
  } = api.posts.getPostsFromUser.useQuery(
    {
      handle: router.query.handle as string,
    },
    {
      enabled: !!router.query.handle,
    },
  );

  const { mutate: followMutation } = api.follows.followUser.useMutation({
    onSuccess: () => {
      toast.success("successfully followed user ✨");
      utils.posts.invalidate();
    },
    onError: () => {
      toast.error("error occurred following user");
    },
  });
  const { mutate: unfollowMutation } = api.follows.unfollowUser.useMutation({
    onSuccess: () => {
      toast.success("successfully unfollowed user 👋");
      utils.posts.invalidate();
    },
    onError: () => {
      toast.error("error occurred unfollowing user");
    },
  });
  const { mutate: expressAccountMutation } =
    api.stripe.createExpressAccount.useMutation({
      onSuccess: (resp) => {
        router.replace(resp.url);
      },
    });

  function followHandler() {
    if (!profileData) return;

    if (profileData.user.isFollowing) {
      unfollowMutation({
        userId: router.query.id as string,
      });
    } else {
      followMutation({
        userId: router.query.id as string,
      });
    }
  }

  function SubscriptionModal() {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowSubscriptionModal(false);
      }
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <Overlay>
        <div
          ref={modalRef}
          className="flex flex-col justify-center rounded-lg bg-input p-6"
        >
          <span className="text-center text-2xl">
            Subscribe to {profileData?.user.name} ✨
          </span>
          <p className="text-grey">
            The subscription cost is $
            {profileData?.user.subscriptionSetting?.price}/month.
          </p>
          <button
            onClick={() => {
              setShowSubscriptionModal(false);
              setShowPaymentElement(true);
            }}
            className="mt-5 rounded-[4px] bg-primary py-1 hover:bg-primary_hover"
          >
            Subscribe
          </button>
        </div>
      </Overlay>
    );
  }

  if (profileLoading || profileError) {
    return null;
  }

  return (
    <div className="h-[calc(100vh_-_56px)] overflow-y-scroll md:w-[50%]">
      {showSubscriptionModal && profileData.user.subscriptionSetting && (
        <SubscriptionModal />
      )}
      {showPaymentElement &&
        profileData.user.subscriptionSetting?.priceId &&
        profileData.currentUser?.stripe_customer_id &&
        profileData.user.subscriptionSetting.connectAccountId && (
          <SubscriptionPaymentModal
            priceId={profileData.user.subscriptionSetting.priceId}
            customerId={profileData.currentUser.stripe_customer_id}
            connectAccountId={
              profileData.user.subscriptionSetting.connectAccountId
            }
            setShowPaymentModal={setShowPaymentElement}
            subscriberId={profileData.currentUser.id}
            subscribedToId={profileData.user.id}
          />
        )}
      <div className="md:px-5">
        {profileData.user.profile_header_url ? (
          <div className="relative h-[125px] w-full bg-red-100 md:rounded-[12px]">
            <Image
              src={profileData.user.profile_header_url}
              alt={`${profileData.user.name}'s profile header`}
              layout="fill"
              objectFit="cover"
              priority={true}
              className="md:rounded-[12px]"
            />
          </div>
        ) : (
          <div className="h-[125px] w-full bg-primary md:rounded-[12px]" />
        )}
      </div>
      <div className="px-5">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-start gap-4 ">
            {profileData.user.profile_picture_url ? (
              <Image
                src={profileData.user.profile_picture_url}
                alt={`${profileData.user.name}'s profile picture`}
                width={70}
                height={70}
                priority={true}
                className="h-[70px] w-[70px] rounded-[100px] bg-white object-cover"
              />
            ) : (
              <div className="h-[70px] w-[70px] rounded-[100px] bg-white" />
            )}
            <div className="flex h-[70px] flex-col justify-between leading-none">
              <span className="text-[26px] font-medium">
                {profileData.user.name}
              </span>
              <span className="text-[16px] text-grey">
                @{profileData.user.handle}
              </span>
              <span className="text-[14px] text-grey">
                {profileData.user._count.followers} Followers
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                title="copy profile link"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/${profileData.user.handle}`,
                  );
                  toast.success("copied to clipboard");
                }}
                className="w-fit rounded-[100px] border-[1px] border-solid border-input p-2 text-[12px] text-white hover:bg-card_hover"
              >
                <Share2Icon height={20} width={20} />
              </button>
              <Link
                title="settings"
                href={"/settings"}
                className="w-fit rounded-[100px] border-[1px] border-solid border-input p-2 text-[12px] text-white hover:bg-card_hover"
              >
                <GearIcon height={20} width={20} />
              </Link>
            </div>
            {profileData.user.isMe &&
            !profileData.user.subscriptionSetting?.isComplete ? (
              <button
                onClick={() => expressAccountMutation()}
                className="rounded-xl bg-primary px-3 py-1 text-[12px] text-white hover:bg-primary_hover"
              >
                activate subscriptions
              </button>
            ) : null}
            {profileData.user.isMe &&
            profileData.user.subscriptionSetting?.isComplete &&
            !profileData.user.subscriptionSetting.priceId ? (
              <Link
                href={"/settings/monetization"}
                className="mt-5 rounded-xl bg-primary px-3 py-1 text-[12px] text-white hover:bg-primary_hover"
              >
                finish setup
              </Link>
            ) : null}
          </div>
        </div>
        {!profileData.user.isMe && (
          <div className="flex gap-2">
            <button
              onClick={followHandler}
              className="flex w-full items-center justify-center gap-2 rounded-[100px] bg-white py-[4px] font-medium text-black hover:bg-white_hover"
            >
              <PersonIcon />
              {profileData.user.isFollowing ? "Unfollow" : "Follow"}
            </button>
            {profileData.user.subscriptionSetting ? (
              <button
                onClick={() => {
                  if (!profileData.user.subscriber) {
                    setShowSubscriptionModal(true);
                  }
                }}
                className="flex w-full items-center justify-center gap-2 rounded-[100px] bg-primary py-[4px] font-medium hover:bg-primary_hover"
              >
                {profileData.user.subscriber ? "✨" : <LockClosedIcon />}
                {profileData.user.subscriber ? "Subscribed" : "Subscribe"}
              </button>
            ) : null}
          </div>
        )}
        <div className="mb-4 flex items-center gap-5 border-b-[.5px] border-grey py-2 font-medium">
          <button
            onClick={() => setTabSelected("home")}
            className={`${tabSelected === "home" ? "text-white" : "text-grey"}`}
          >
            Home
          </button>
          <button
            onClick={() => setTabSelected("videos")}
            className={`${
              tabSelected === "videos" ? "text-white" : "text-grey"
            }`}
          >
            Videos
          </button>
        </div>
        <UserPostsContainer
          data={
            tabSelected === "home"
              ? profileData.posts
              : profileData.posts.filter((post) => post.video)
          }
        />
      </div>
    </div>
  );
}

export default User;

User.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
