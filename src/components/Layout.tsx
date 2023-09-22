import React from "react";
import MobileNavigation from "./MobileNavigation";
import type { ReactNode } from "react";
import useScreenSize from "~/hooks/useScreenSize";
import DesktopNavigation from "./DesktopNavigation";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({
  children: children,
}: LayoutProps): JSX.Element {
  const isMobile = useScreenSize();

  return (
    <div className="md:flex md:w-screen md:items-start md:gap-10 md:p-[50px]">
      {isMobile ? <MobileNavigation /> : <DesktopNavigation />}
      <>{children}</>
    </div>
  );
}
