import React, { useMemo, useState } from "react";
import { api } from "~/lib/utils/api";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

const bongoURL = "/sounds/bongo.m4a";
const clocURL = "/sounds/cloc.m4a";
const malletURL = "/sounds/mallet.m4a";

function Landing() {
  const [isClicked, setIsClicked] = useState<Record<string, boolean> | null>(
    null,
  );

  const boxShadowStyle = {
    boxShadow:
      "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  };

  const bubbleTextStyle = {
    color: "transparent",
    WebkitTextStroke: ".5px white",
  };

  const bubbleTextStyleWithShadow = {
    ...bubbleTextStyle,
    ...boxShadowStyle,
  };

  function handleKeyPress(key: string) {
    toggleAudio(key);
    setIsClicked({ ...isClicked, [key]: true });
    setTimeout(() => {
      setIsClicked((prev) => ({ ...prev, [key]: false }));
    }, 100);
  }

  function toggleAudio(key: string) {
    switch (key) {
      case "ctrl":
        const audio = new Audio(bongoURL);
        audio.play();
        break;
      case "cmd":
        const audio2 = new Audio(clocURL);
        audio2.play();
        break;
      case "alt":
        const audio3 = new Audio(malletURL);
        audio3.play();
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-1 py-[200px]">
        <span className="mr-20 -rotate-[34deg] self-end text-[30px]">🦋</span>
        <h1 className="font-sf text-[50px] font-bold leading-none">
          Hush Asmr
        </h1>
        <span className="w-[250px] text-center font-sf text-[20px] text-[#676767]">
          Where exceptional sounds get discovered.
        </span>
        <div className="my-5 flex items-end gap-[5px] rounded-[11px] bg-[#C9CBD2] p-[5px] text-[16px]">
          <button
            onClick={() => handleKeyPress("ctrl")}
            style={
              isClicked && isClicked.ctrl
                ? bubbleTextStyle
                : bubbleTextStyleWithShadow
            }
            className="rounded-[6px] border-[1px] border-solid border-black bg-input px-[10px] py-[8px]"
          >
            ctrl
          </button>
          <button
            onClick={() => handleKeyPress("cmd")}
            style={
              isClicked && isClicked.cmd
                ? bubbleTextStyle
                : bubbleTextStyleWithShadow
            }
            className="rounded-[6px] border-[1px] border-solid border-black bg-input px-[10px] py-[8px]"
          >
            cmd
          </button>
          <Link
            href="/home"
            onClick={() => handleKeyPress("watch")}
            style={isClicked && isClicked.watch ? {} : boxShadowStyle}
            className="rounded-[6px] border-[1px] border-solid border-black border-opacity-20 bg-primary px-[20px] py-[8px] font-sf"
          >
            start watching
          </Link>
          <button
            onClick={() => handleKeyPress("alt")}
            style={
              isClicked && isClicked.alt
                ? bubbleTextStyle
                : bubbleTextStyleWithShadow
            }
            className="rounded-[6px] border-[1px] border-solid border-black bg-input px-[10px] py-[8px]"
          >
            alt
          </button>
        </div>
        <div className="absolute bottom-[-100px] left-0 right-0 overflow-hidden">
          <div className="relative h-[300px] w-[300px]">
            <Image
              src={"/images/cloud.png"}
              className="ml-[-20px]"
              alt="a beautiful cloud"
              layout="fill"
              objectFit="contain"
            />
            <Image
              src={"/images/cloud.png"}
              className="ml-[175px]"
              alt="a beautiful cloud"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
