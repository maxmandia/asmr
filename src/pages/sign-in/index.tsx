import React, { useRef, useState } from "react";
import { SignIn, useSignIn } from "@clerk/nextjs";
import Layout from "~/components/Layout";
import { dark } from "@clerk/themes";
import { OAuthStrategy } from "@clerk/nextjs/dist/types/server";
import Image from "next/image";
import {
  ArrowLeftIcon,
  EnvelopeClosedIcon,
  MagicWandIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

function Page() {
  const { signIn } = useSignIn();
  const emailRef = useRef<HTMLInputElement>(null);
  const [showEmailInput, setShowEmailInput] = useState(false);

  const signInWith = (strategy: OAuthStrategy) => {
    if (!signIn) {
      return;
    }
    return signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/home",
    });
  };

  return (
    <div className="flex h-screen w-full items-center justify-center md:items-start md:py-[300px]">
      <div className="flex flex-col items-center justify-center">
        <span className="font-light">Sign-in to</span>
        <span className="font-sf text-[40px] font-bold">Hush Asmr</span>
        <div className="flex flex-col items-center justify-center gap-2 py-5">
          {showEmailInput ? (
            <>
              <input
                ref={emailRef}
                type="email"
                className="w-[250px] rounded-md bg-input px-4 py-2 outline-none placeholder:text-grey"
                placeholder="johnnyappleseed@gmail.com"
              />
              <button className="flex w-[250px] items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 hover:bg-primary_hover">
                <MagicWandIcon className="h-5 w-5" />
                Send magic link
              </button>
              <button
                onClick={() => setShowEmailInput(false)}
                className="flex items-center gap-1 py-2 text-[14px] text-grey hover:underline"
              >
                <ArrowLeftIcon className="h-5 w-5" color="#808080" />
                other login options
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => signInWith("oauth_google")}
                className="flex w-[250px] items-center justify-center gap-2 rounded-md bg-input px-4 py-2 hover:bg-input_hover"
              >
                <Image
                  src="/images/google.png"
                  alt="Google"
                  width={20}
                  height={20}
                />
                Use Google
              </button>
              <button
                onClick={() => setShowEmailInput(true)}
                className="flex w-[250px] items-center justify-center gap-2 rounded-md bg-input px-4 py-2 hover:bg-input_hover"
              >
                <EnvelopeClosedIcon className="h-5 w-5" />
                Continue with email
              </button>
            </>
          )}
        </div>
        <span className="text-grey">
          Don&apos;t have an account?{" "}
          <Link href={"/sign-up"} className="text-primary hover:underline">
            Sign up here.
          </Link>
        </span>
      </div>
    </div>
  );
}

export default Page;
