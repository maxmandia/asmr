import React, { ReactNode, useEffect } from "react";
import MobileNavigation from "./MobileNavigation";
import DesktopNavigation from "./DesktopNavigation";
import { useUser } from "@clerk/nextjs";
import posthog from "posthog-js";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      posthog.identify(user.id, {
        email: user.emailAddresses[0]?.emailAddress,
      });
    }
  }, [user]);

  return (
    <div className="h-screen md:flex md:w-screen md:items-start md:gap-10 md:p-[50px] lg:px-[200px]">
      <div className="md:hidden">
        <MobileNavigation />
      </div>
      <div className="hidden md:block">
        <DesktopNavigation />
      </div>
      {children}
    </div>
  );
};

export default Layout;
