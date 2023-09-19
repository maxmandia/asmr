import { useUser } from "@clerk/nextjs";
import Layout from "~/components/Layout";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { UserButton, SignInButton } from "@clerk/nextjs";
export default function Home() {
  const user = useUser();
  console.log(user);

  if (!user.isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-between px-5 py-7">
      <div>[ASMR]</div>
      <div className="flex items-center justify-center gap-2">
        <MagnifyingGlassIcon height={25} width={25} color="white" />
        {user.isSignedIn ? (
          <UserButton afterSignOutUrl="/sign-in" />
        ) : (
          <SignInButton afterSignInUrl="/" />
        )}
      </div>
    </div>
  );
}

Home.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
