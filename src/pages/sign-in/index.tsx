import React, { useRef, useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { OAuthStrategy } from "@clerk/nextjs/dist/types/server";
import Image from "next/image";
import {
  ArrowLeftIcon,
  EnvelopeClosedIcon,
  MagicWandIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

function Page() {
  const { signIn } = useSignIn();
  const emailRef = useRef<HTMLInputElement>(null);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const router = useRouter();

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

  const { startEmailLinkFlow, cancelEmailLinkFlow } =
    signIn?.createEmailLinkFlow() ?? {};

  async function sendMagicLink() {
    if (!signIn || !startEmailLinkFlow) {
      return;
    }

    try {
      const si = await signIn.create({
        identifier: emailRef.current?.value ?? "",
      });
      const { emailAddressId } = si.supportedFirstFactors.find(
        (ff) =>
          ff.strategy === "email_link" &&
          ff.safeIdentifier === emailRef.current?.value,
      ) as any;

      toast.success("Email sent!");
      const res = await startEmailLinkFlow({
        emailAddressId: emailAddressId,
        redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/verified`,
      });

      const verification = res.firstFactorVerification;
      if (verification.verifiedFromTheSameClient()) {
        // If you're handling the verification result from
        // another route/component, you should return here.
        // See the <Verification/> component as an
        // example below.
        // If you want to complete the flow on this tab,
        // don't return. Simply check the sign in status.
        // return;
      } else if (verification.status === "expired") {
        // setExpired(true);
      }
      if (res.status === "complete") {
        // setActive({ session: res.createdSessionId });
        //Handle redirect
        router.push("/home");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

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
              <button
                onClick={sendMagicLink}
                className="flex w-[250px] items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 hover:bg-primary_hover"
              >
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
