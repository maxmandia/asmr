import { type AppType } from "next/dist/shared/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import "~/styles/globals.css";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { api } from "../lib/utils/api";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import localFont from "next/font/local";
import Head from "next/head";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const sf = localFont({
  src: [
    {
      path: "../../public/fonts/SF-Pro-Rounded-Bold.otf",
      weight: "700",
    },
    {
      path: "../../public/fonts/SF-Pro-Rounded-Medium.otf",
      weight: "500",
    },
    {
      path: "../../public/fonts/SF-Pro-Rounded-Heavy.otf",
      weight: "800",
    },
  ],
  variable: "--font-sf-rounded",
});

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ClerkProvider {...pageProps}>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
          />
        </Head>
        <div className={`h-screen bg-background text-text ${sf.variable}`}>
          {getLayout(<Component {...pageProps} />)}
          <Analytics />
        </div>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
