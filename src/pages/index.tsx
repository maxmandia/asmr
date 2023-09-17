import { useUser } from "@clerk/nextjs";
import BottomNavigation from "~/components/BottomNavigation";

export default function Home() {
  const user = useUser();
  if (!user.isLoaded) {
    return <div>Loading...</div>;
  }

  // if (!user.isSignedIn) {
  //   return <BottomNavigation />;
  // }

  return <BottomNavigation />;
}
