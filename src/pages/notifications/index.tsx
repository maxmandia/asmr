import React from "react";
import Layout from "~/components/Layout";

function Notifications() {
  return (
    <div className="p-5">
      <span>Notifications</span>
    </div>
  );
}

export default Notifications;

Notifications.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
