import React from "react";
import { SignIn } from "@clerk/nextjs";
import Layout from "~/components/Layout";
import { dark } from "@clerk/themes";

function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center md:items-start md:py-[300px]">
      <div className="flex flex-col items-center justify-center">
        <button>google</button>
      </div>
    </div>
  );
}

Page.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};

export default Page;
