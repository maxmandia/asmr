import { type AppType } from "next/dist/shared/lib/utils";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import "~/styles/globals.css";
import { type ReactElement, type ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { api } from "../lib/utils/api";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import localFont from "next/font/local";
import Head from "next/head";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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

if (typeof window !== "undefined" && process.env.NODE_ENV !== "development") {
  // checks that we are client-side
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "", {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug(); // debug mode in development
    },
  });
}

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ClerkProvider {...pageProps}>
      <PostHogProvider client={posthog}>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
            />
            <link rel="icon" href="/favicon.png" />
          </Head>
          <div className={`h-screen bg-background text-text ${sf.variable}`}>
            {getLayout(<Component {...pageProps} />)}
            <Analytics />
            <SpeedInsights />
          </div>
        </QueryClientProvider>
      </PostHogProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
