import React, { useRef, useState } from "react";
import Image from "next/image";
import type { Post } from "~/types/Post";
import Link from "next/link";
import UserProfilePicture from "./UserProfilePicture";
import { SubscribedUsers } from "~/types/SubscribedUsers";
import MuxPlayer from "@mux/mux-player-react";
interface Props {
  post: Post;
  subscribedUsers: SubscribedUsers;
  isLast: boolean;
}

function UserPost(props: Props) {
  const { post, subscribedUsers, isLast } = props;

  return (
    <div className={`${isLast ? "pb-[150px] md:pb-[50px]" : ""}`}>
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
                <div>
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
            <div>
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

function PostVideo(post: Post) {
  return (
    <div className="relative mt-5 h-[300px] w-full overflow-hidden rounded-[18px]">
      <MuxPlayer
        className="absolute left-0 top-0 h-full w-full object-cover"
        streamType="on-demand"
        playbackId={post.playbackId}
      />
    </div>
  );
}
