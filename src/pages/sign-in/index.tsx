import React from "react";
import { SignIn } from "@clerk/nextjs";

function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn redirectUrl={"/"} />
    </div>
  );
}

export default Page;
