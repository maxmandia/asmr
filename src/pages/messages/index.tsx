import React from "react";
import Layout from "~/layouts/Layout";
import { MessageseLayout } from "~/layouts/MessagesLayout";

function Messages() {
  return null;
}

export default Messages;

Messages.getLayout = function getLayout(page: JSX.Element) {
  return (
    <Layout>
      <MessageseLayout>{page}</MessageseLayout>
    </Layout>
  );
};
