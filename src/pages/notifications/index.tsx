import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import React from "react";
import Layout from "~/components/Layout";
import { api } from "~/lib/utils/api";
import UserProfilePicture from "~/components/UserProfilePicture";

function Notifications() {
  const { data, isLoading, isError } =
    api.notifications.getNotifications.useQuery();

  if (isLoading || isError) {
    return null;
  }
  return (
    <div className="p-5">
      <span>Notifications</span>
      <div className="py-5">
        {data.map((notification, index) => {
          return (
            <div key={index} className="flex items-start gap-4">
              <StarFilledIcon height={20} width={20} />
              <div>
                <UserProfilePicture
                  profile_picture_url={
                    notification.subscriber.profile_picture_url
                  }
                />
                <span>
                  New subscription from{" "}
                  <span className="font-medium">
                    @{notification.subscriber.handle}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Notifications;

Notifications.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
