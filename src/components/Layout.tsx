import React, { ReactNode } from "react";
import MobileNavigation from "./MobileNavigation";
import DesktopNavigation from "./DesktopNavigation";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="md:flex md:w-screen md:items-start md:gap-10 md:p-[50px]">
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
