import React from "react";
import Layout from "~/components/Layout";

function Messages() {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="w-2/3  px-10">
        <div className="flex w-full items-center justify-between">
          <span className="text-[18px] font-medium">Messages</span>
          <button>New message</button>
        </div>
      </div>
      <div>a message content</div>
    </div>
  );
}

export default Messages;

Messages.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
