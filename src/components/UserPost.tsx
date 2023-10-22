import React, { useRef } from "react";
import Image from "next/image";
import { PlayIcon } from "@radix-ui/react-icons";
import type { Post } from "~/types/Post";
interface Props {
  post: Post;
  setExpandedMediaContent: React.Dispatch<React.SetStateAction<Post | null>>;
}

function UserPost(props: Props) {
  const { post, setExpandedMediaContent } = props;

  return (
    <div>
      <div className="flex items-start gap-3">
        <UserPFP {...post} />
        <div className="flex w-full flex-col">
          <span className="font-medium">{post.user.first_name}</span>
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
    <Image
      priority={true}
      className="rounded-[30px]"
      width={30}
      height={30}
      src={post.user.profile_picture_url}
      alt={`${post.user.first_name}'s pfp`}
    />
  );
}

function PostImage(post: Post) {
  if (!post.image) return null;

  return (
    <Image
      className="mt-5 h-[200px] w-full rounded-[6px] object-cover"
      src={post.image}
      alt="post image"
      width={200}
      height={200}
    />
  );
}

function PostVideo(post: Post) {
  const videoRef = useRef<HTMLVideoElement>(null);

  function handleFullscreen() {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  }

  if (!post.video) return null;

  return (
    <div className="relative mt-5" onClick={handleFullscreen}>
      <video
        ref={videoRef}
        className=" h-[200px] w-full rounded-[6px] object-cover"
        src={post.video}
        loop
        muted
      />
      <div className="absolute left-0 top-0 flex h-[200px] w-full items-center justify-center">
        <div className="rounded-[100px] bg-primary p-2">
          <PlayIcon height={35} width={35} color="white" />
        </div>
      </div>
    </div>
  );
}
