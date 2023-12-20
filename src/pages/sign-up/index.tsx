import React, { useEffect, useMemo, useRef, useState } from "react";
import { SignIn, useSignIn, useSignUp } from "@clerk/nextjs";
import Layout from "~/components/Layout";
import { dark } from "@clerk/themes";
import { OAuthStrategy } from "@clerk/nextjs/dist/types/server";
import Image from "next/image";
import {
  ArrowLeftIcon,
  EnvelopeClosedIcon,
  MagicWandIcon,
  StarFilledIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { api } from "~/lib/utils/api";

function Page() {
  const router = useRouter();
  const handleRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [handle, setHandle] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showHandleInput, setShowHandleInput] = useState(true);
  const { signUp, isLoaded, setActive } = useSignUp();
  const { data, refetch } = api.users.validateHandle.useQuery(
    { handle: handle },
    {
      enabled: false,
      onSuccess(data) {
        toast.remove();
        if (data) {
          toast.error("Handle already exists");
        } else {
          toast.success("Handle available");
          setShowHandleInput(false);
        }
      },
    },
  );
  const { refetch: refetchDoesEmailExist } = api.users.validateHandle.useQuery(
    { handle: emailRef.current?.value ?? "" },
    {
      enabled: false,
      onSuccess(data) {
        toast.remove();
        if (data) {
          toast.error("Email is already associated with an account");
        } else {
          sendMagicLink();
        }
      },
      onError(err) {
        toast.error("Something went wrong");
      },
    },
  );

  if (!isLoaded) {
    return null;
  }

  const { startEmailLinkFlow, cancelEmailLinkFlow } =
    signUp?.createEmailLinkFlow();

  async function sendMagicLink() {
    if (!signUp) {
      return;
    }

    if (!emailRef.current || emailRef.current.value === "") {
      return toast.error("Please enter your email address");
    }

    try {
      await signUp.create({
        emailAddress: emailRef.current.value,
        username: handle,
      });

      toast.success("Email sent!");
      const su = await startEmailLinkFlow({
        redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/verified`,
      });

      // Check the verification result.
      const verification = su.verifications.emailAddress;
      if (verification.verifiedFromTheSameClient()) {
        // If you're handling the verification result from
        // another route/component, you should return here.
        // See the <MagicLinkVerification/> component as an
        // example below.
        // If you want to complete the flow on this tab,
        // don't return. Check the sign up status instead.
        //   return;
      }
      if (su.status === "complete") {
        setActive({
          session: su.createdSessionId,
          beforeEmit: () => router.push("/home"),
        });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }
  const signUpWith = async (strategy: OAuthStrategy) => {
    if (!signUp) {
      return;
    }
    return signUp.authenticateWithRedirect({
      strategy: strategy,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/home",
      unsafeMetadata: {
        username: handle,
      },
    });
  };

  return (
    <div className="flex h-screen w-full items-center justify-center md:items-start md:py-[300px]">
      <div className="flex flex-col items-center justify-center">
        <span className="font-light">
          {showHandleInput ? "Grab a handle" : "Choose an auth method"} for
        </span>
        <span className="font-sf text-[40px] font-bold">Hush Asmr</span>
        <div className="flex flex-col items-center justify-center gap-2 py-5">
          {showHandleInput ? (
            <>
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                type="text"
                className="w-[250px] rounded-md bg-input px-4 py-2 outline-none placeholder:text-grey"
                placeholder="johnnyappleseed"
              />
              <button
                disabled={handle === ""}
                onClick={() => refetch()}
                className={`flex w-[250px] items-center justify-center gap-2 rounded-md px-4 py-2 ${
                  handle === ""
                    ? "bg-card_hover"
                    : "bg-primary hover:bg-primary_hover"
                }`}
              >
                <StarFilledIcon className="h-5 w-5" />
                Next
              </button>
            </>
          ) : (
            <>
              {showEmailInput ? (
                <>
                  <input
                    ref={emailRef}
                    type="email"
                    className="w-[250px] rounded-md bg-input px-4 py-2 outline-none placeholder:text-grey"
                    placeholder="johnnyappleseed@gmail.com"
                  />
                  <button
                    onClick={() => refetchDoesEmailExist()}
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
                    onClick={() => signUpWith("oauth_google")}
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
            </>
          )}
        </div>
        <span className="text-grey">
          Have an account?{" "}
          <Link href={"/sign-in"} className="text-primary hover:underline">
            Login here.
          </Link>
        </span>
      </div>
    </div>
  );
}

export default Page;
