import React from "react";
import Layout from "~/components/Layout";
import NotificationEmail from "~/components/NotificationEmail";
import { emailMessages } from "~/lib/data/example-email-messages";

function Notifications() {
  return <NotificationEmail messages={emailMessages} />;
}

export default Notifications;

Notifications.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
