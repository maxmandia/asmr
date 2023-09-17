import { useUser } from "@clerk/nextjs";
import BottomNavigation from "~/components/BottomNavigation";
import Layout from "~/components/Layout";

export default function Home() {
  const user = useUser();
  if (!user.isLoaded) {
    return <div>Loading...</div>;
  }

  // if (!user.isSignedIn) {
  //   return <BottomNavigation />;
  // }

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
