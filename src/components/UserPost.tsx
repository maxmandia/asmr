import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  EnterFullScreenIcon,
  PauseIcon,
  PlayIcon,
} from "@radix-ui/react-icons";
import type { Post } from "~/types/Post";
import Link from "next/link";
interface Props {
  post: Post;
  setExpandedMediaContent: React.Dispatch<React.SetStateAction<Post | null>>;
}

function UserPost(props: Props) {
  const { post, setExpandedMediaContent } = props;

  return (
    <div>
      <div className="flex items-start gap-3">
        <Link href={`/${post.user.handle}`} prefetch={false}>
          <UserPFP {...post} />
        </Link>
        <div className="flex w-full flex-col">
          <Link href={`/${post.user.handle}`} prefetch={false}>
            <span className="font-medium hover:underline">
              {post.user.first_name}
            </span>
          </Link>
          <p className="text-[14px]">{post.caption}</p>
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
        </div>
      </div>
    </div>
  );
}

export default UserPost;

function UserPFP(post: Post) {
  if (!post.user.profile_picture_url) {
    return <div className="h-[30px] w-[30px] rounded-[30px] bg-primary" />;
  }

  return (
    <div className="relative h-[30px] w-[30px]">
      <Image
        priority={true}
        className="rounded-[200px]"
        layout="fill"
        objectFit="cover"
        src={post.user.profile_picture_url}
        alt={`${post.user.first_name}'s pfp`}
      />
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
