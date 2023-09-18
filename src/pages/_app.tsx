import { type AppType } from "next/dist/shared/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import "~/styles/globals.css";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <div className="text-text h-screen bg-background">
      <ClerkProvider {...pageProps}>
        {getLayout(<Component {...pageProps} />)}
      </ClerkProvider>
    </div>
  );
};

export default MyApp;
