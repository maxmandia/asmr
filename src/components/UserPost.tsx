import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  EnterFullScreenIcon,
  PauseIcon,
  PlayIcon,
} from "@radix-ui/react-icons";
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
  const [showVideoToolbar, setShowVideoToolbar] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  function handleFullscreen() {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  }

  function handlePlayback() {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  }

  if (!post.video) return null;

  return (
    <div
      className="relative mt-5 h-[300px] w-full overflow-hidden rounded-[18px]"
      onMouseOver={() => setShowVideoToolbar(true)}
      onMouseLeave={() => setShowVideoToolbar(false)}
    >
      <video
        onClick={() => {
          handlePlayback();
        }}
        onDoubleClick={handleFullscreen}
        ref={videoRef}
        className="absolute left-0 top-0 h-full w-full object-contain"
        src={post.video}
        loop
      />
      {/* <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
        <div className="rounded-[100px] bg-primary p-2">
          <PlayIcon height={35} width={35} color="white" />
        </div>
      </div> */}
      {showVideoToolbar ? (
        <VideoToolbar
          handleVideoPlayback={handlePlayback}
          setIsVideoPlaying={setIsVideoPlaying}
          isVideoPlaying={isVideoPlaying}
          handleFullscreen={handleFullscreen}
        />
      ) : null}
    </div>
  );
}

interface VideoToolbarProps {
  setIsVideoPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  isVideoPlaying: boolean;
  handleVideoPlayback: () => void;
  handleFullscreen: () => void;
}

function VideoToolbar(props: VideoToolbarProps) {
  const {
    setIsVideoPlaying,
    isVideoPlaying,
    handleVideoPlayback,
    handleFullscreen,
  } = props;

  return (
    <div className="absolute bottom-0 z-[100] w-full bg-black bg-opacity-5 p-3">
      <div />
      <div className="flex items-center justify-between">
        {isVideoPlaying ? (
          <div
            onClick={handleVideoPlayback}
            className="rounded-[6px] p-2 hover:bg-white hover:bg-opacity-5"
          >
            <PauseIcon height={25} width={25} />
          </div>
        ) : (
          <div
            onClick={handleVideoPlayback}
            className="rounded-[6px] p-2 hover:bg-white hover:bg-opacity-5"
          >
            <PlayIcon height={25} width={25} />
          </div>
        )}
        <div>
          <div
            onClick={handleFullscreen}
            className="rounded-[6px] p-2 hover:bg-white hover:bg-opacity-5"
          >
            <EnterFullScreenIcon height={25} width={25} />
          </div>
        </div>
      </div>
    </div>
  );
}
