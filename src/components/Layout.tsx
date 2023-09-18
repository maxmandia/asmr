import React from "react";
import BottomNavigation from "./BottomNavigation";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({
  children: children,
}: LayoutProps): JSX.Element {
  return (
    <>
      <main>{children}</main>
      <BottomNavigation />
    </>
  );
}
