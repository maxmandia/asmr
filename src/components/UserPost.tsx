import React, { useRef, useState } from "react";
import Image from "next/image";
import type { Post } from "~/types/Post";
import Link from "next/link";
import UserProfilePicture from "./UserProfilePicture";
import { SubscribedUsers } from "~/types/SubscribedUsers";

interface Props {
  post: Post;
  setExpandedMediaContent: React.Dispatch<React.SetStateAction<Post | null>>;
  subscribedUsers: SubscribedUsers;
}

function UserPost(props: Props) {
  const { post, setExpandedMediaContent, subscribedUsers } = props;

  return (
    <div>
      <div className="flex items-start gap-3">
        <Link href={`/${post.user.handle}`} prefetch={false}>
          <UserProfilePicture
            profile_picture_url={post.user.profile_picture_url}
          />
        </Link>
        <div className="flex w-full flex-col">
          <Link href={`/${post.user.handle}`} prefetch={false}>
            <span className="font-medium hover:underline">
              {post.user.name}
            </span>
          </Link>
          <p className="text-[14px]">{post.caption}</p>
          {post.isPaid ? (
            <>
              {subscribedUsers.includes(post.user.id) ? (
                // ✅ the user is subscribed and can view the exclusive content ✅
                <div
                  onClick={() => {
                    if (post.image) {
                      setExpandedMediaContent(post);
                    }
                  }}
                >
                  <PostImage {...post} />
                  <PostVideo {...post} />
                </div>
              ) : (
                // 🚫 the user can NOT view the exclusive content 🚫
                <>
                  <LockedContent {...post} />
                  <PostVideo {...post} />
                </>
              )}
            </>
          ) : (
            // ✅ the post is not exclusive, anyone can view it ✅
            <div
              onClick={() => {
                if (post.image) {
                  setExpandedMediaContent(post);
                }
              }}
            >
              <PostImage {...post} />
              <PostVideo {...post} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPost;

function LockedContent(post: Post) {
  if (!post.image && !post.video) {
    return null;
  }

  return (
    <div className="relative mt-5 h-[300px] w-full overflow-hidden rounded-[18px] transition duration-300 ease-in-out hover:bg-opacity-60">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[18px] bg-card_hover bg-opacity-50">
        <p className="text-xl font-medium text-white md:text-2xl">
          This post is locked.
        </p>
        <Link
          prefetch={false}
          href={`/${post.user.handle}`}
          className="rounded-[6px] bg-primary px-4 py-2 text-[14px] hover:bg-primary_hover"
        >
          ✨ Subscribe
        </Link>
      </div>
    </div>
  );
}

function PostImage(post: Post) {
  if (!post.image) return null;

  return (
    <div className="relative mt-5 h-[300px] w-full overflow-hidden rounded-[18px]">
      <Image
        layout="fill"
        objectFit="cover"
        src={post.image}
        alt="post image"
      />
    </div>
  );
}

function PostVideo(post: Post) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showControls, setShowControls] = useState(false);

  if (!post.video) return null;

  return (
    <div
      className="relative mt-5 h-[300px] w-full overflow-hidden rounded-[18px]"
      onMouseOver={() => setShowControls(true)}
    >
      <video
        onClick={() => {
          if (!showControls) {
            setShowControls(true);
          }
        }}
        controls={showControls}
        autoPlay
        controlsList="nodownload"
        muted
        ref={videoRef}
        className="absolute left-0 top-0 h-full w-full object-cover"
        src={post.video}
        playsInline
        loop
      />
    </div>
  );
}
