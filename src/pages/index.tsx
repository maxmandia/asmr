import React, { useState } from "react";
import Image from "next/image";
import {
  CookieIcon,
  LockOpen2Icon,
  MagicWandIcon,
} from "@radix-ui/react-icons";
import styles from "~/styles/home.module.css";
import Link from "next/link";
import Head from "next/head";

const bongoURL = "/sounds/bongo.m4a";
const clocURL = "/sounds/cloc.m4a";
const malletURL = "/sounds/mallet.m4a";

const animals = ["bunny", "cow", "dog", "fox"];

const animals2 = ["tiger", "owl", "panda", "pig"];

const peopleColors = [
  "blue-person",
  "green-person",
  "orange-person",
  "purple-person",
  "red-person",
  "yellow-person",
];

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
    WebkitTextStroke: "1px white",
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
      <Head>
        <title>Watch Sexy Asmr Videos</title>
        <meta property="og:title" content="Hush Asmr" key="title" />
        <meta
          name="description"
          content="Discover sexy asmr videos and sounds. Watch the best asmr videos on the internet."
        />
      </Head>
      <div className="flex h-screen flex-col items-center gap-1 py-40">
        <span className="mr-20 -rotate-[34deg] self-end text-[30px] md:ml-[500px] md:self-center md:text-[40px] lg:text-[50px]">
          🦋
        </span>
        <h1 className="font-sf text-[50px] font-bold leading-none md:text-[80px] lg:text-[90px]">
          Hush Asmr
        </h1>
        <span className="w-[250px] text-center font-sf text-[20px] text-[#797979] md:w-full md:text-[24px]">
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
            className="rounded-[6px] border-[1px] border-solid border-black bg-input px-[10px] py-[8px] md:text-[20px] lg:text-[24px]"
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
            className="rounded-[6px] border-[1px] border-solid border-black bg-input px-[10px] py-[8px] md:text-[20px] lg:text-[24px]"
          >
            cmd
          </button>
          <Link
            href={"home"}
            style={isClicked && isClicked.watch ? {} : boxShadowStyle}
            className="rounded-[6px] border-[1px] border-solid border-black border-opacity-20 bg-primary px-[20px] py-[8px] font-sf md:text-[20px] lg:text-[24px]"
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
            className="rounded-[6px] border-[1px] border-solid border-black bg-input px-[10px] py-[8px] md:text-[20px] lg:text-[24px]"
          >
            alt
          </button>
        </div>
        <div className="absolute bottom-[-100px] left-0 right-0 ml-[-20px] flex items-center justify-between overflow-hidden md:bottom-[-150px]">
          <div className="relative h-[300px] w-[300px] flex-shrink-0 md:h-[400px] md:w-[400px] lg:opacity-50">
            <Image
              src={"/images/cloud.webp"}
              alt="a beautiful cloud"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
          <div className="relative z-10 ml-[-150px] h-[300px] w-[300px] flex-shrink-0 md:h-[400px] md:w-[400px] lg:opacity-70">
            <Image
              src={"/images/cloud.webp"}
              alt="a beautiful cloud"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
          <div className="relative z-[0] ml-[-150px] hidden h-[400px] w-[400px] flex-shrink-0 md:block lg:opacity-80">
            <Image
              src={"/images/cloud.webp"}
              alt="a beautiful cloud"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
          <div className="relative z-10 ml-[-150px] hidden h-[400px] w-[400px] flex-shrink-0 md:block lg:opacity-80">
            <Image
              src={"/images/cloud.webp"}
              alt="a beautiful cloud"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
          <div className="relative z-[0] ml-[-150px] hidden h-[400px] w-[400px] flex-shrink-0 md:block lg:opacity-80">
            <Image
              src={"/images/cloud.webp"}
              alt="a beautiful cloud"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
          <div className="relative z-10 ml-[-150px] hidden h-[400px] w-[400px] flex-shrink-0 md:block lg:opacity-70">
            <Image
              src={"/images/cloud.webp"}
              alt="a beautiful cloud"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
          <div className="relative z-[0] ml-[-150px] hidden h-[400px] w-[400px] flex-shrink-0 md:block lg:opacity-50">
            <Image
              src={"/images/cloud.webp"}
              alt="a beautiful cloud"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-10 px-4 py-[200px] lg:flex-row lg:flex-wrap lg:items-center">
        <div
          style={boxShadowStyle}
          className={`${styles.gradient_border} relative flex h-[340px]  max-w-[400px] cursor-pointer flex-col items-center justify-center rounded-[50px] border-[2px] border-solid border-transparent bg-input p-5`}
        >
          <div className="flex w-[98%] flex-col gap-3">
            <LockOpen2Icon height={50} width={50} />
            <h2 className="font-sf text-[28px] font-bold leading-[33px]">
              Unlock content from your favorite creators.
            </h2>
            <p className="text-[18px] leading-[22px] text-[#797979]">
              Access exclusive ASMR content from the world’s best - but keep it
              on the <span className="text-sf font-bold">Hush.</span>
            </p>
          </div>
          <div className="flex items-center gap-1 overflow-hidden pt-6">
            {animals.map((animal) => (
              <div className="flex-shrink-0" key={animal}>
                <Image
                  className="select-none"
                  src={`/images/memojis/${animal}.png`}
                  alt="animal"
                  height={75}
                  width={75}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
        <div
          style={boxShadowStyle}
          className={`${styles.gradient_border} relative flex h-[340px] max-w-[400px] cursor-pointer flex-col items-center justify-center rounded-[50px] border-[2px] border-solid border-transparent bg-input p-5`}
        >
          <div className="flex w-[98%] flex-col gap-3">
            <MagicWandIcon height={50} width={50} />
            <h2 className="font-sf text-[28px] font-bold leading-[33px]">
              Chat with creators like you would with friends.
            </h2>
            <p className="text-[18px] leading-[22px] text-[#797979]">
              Send tips, photos, videos and more for an intimate experience
              that’s truly magical.
            </p>
          </div>
          <div className="overflow-none flex items-center gap-1 pt-6">
            {peopleColors.map((person) => (
              <div className="flex-shrink-0" key={person}>
                <Image
                  className="select-none"
                  src={`/images/person-icons/${person}.png`}
                  alt="person"
                  height={50}
                  width={50}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
        <div
          style={boxShadowStyle}
          className={`${styles.gradient_border} relative flex h-[340px] max-w-[400px] cursor-pointer flex-col items-center justify-center rounded-[50px] border-[2px] border-solid border-transparent bg-input p-5`}
        >
          <div className="flex w-[98%] flex-col gap-3">
            <CookieIcon height={50} width={50} />
            <h2 className="font-sf text-[28px] font-bold leading-[33px]">
              Relaxing, fun, sexy asmr - here for you 24/7.{" "}
            </h2>
            <p className="text-[18px] leading-[22px] text-[#797979]">
              Soothing, playful, sensual ASMR; always here, always your own -
              made just the way you like it.
            </p>
          </div>
          <div className="flex items-center gap-1 overflow-hidden pt-6">
            {animals2.map((animal) => (
              <div className="flex-shrink-0" key={animal}>
                <Image
                  className="select-none"
                  src={`/images/memojis/${animal}.png`}
                  alt="animal"
                  height={75}
                  width={75}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center pb-[200px]">
        <div className="flex w-full flex-col items-center">
          <span className="font-sf text-[120px] font-bold leading-none lg:text-[400px]">
            Hush<span className="text-[50px] lg:text-[75px]">.</span>
          </span>
          <span className="text-[18px] text-[#797979] md:text-[24px]">
            Did you hear that ad?
          </span>
          <span className="text-[18px] text-[#797979]">Neither did we</span>
        </div>
        <span className="text-[100px]">🤫</span>
      </div>
    </div>
  );
}

export default Landing;
