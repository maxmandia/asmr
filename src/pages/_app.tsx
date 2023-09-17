import { type AppType } from "next/dist/shared/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="bg-background h-screen">
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
      </ClerkProvider>
    </div>
  );
};

export default MyApp;
