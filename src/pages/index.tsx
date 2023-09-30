import { useUser } from "@clerk/nextjs";
import Layout from "~/components/Layout";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { UserButton, SignInButton } from "@clerk/nextjs";
import { api } from "~/lib/utils/api";
import UserPost from "~/components/UserPost";

export default function Home() {
  const user = useUser();
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="px-5 py-7 md:w-[60%] md:p-0">
      <div className="flex w-full items-center justify-between">
        <h2>[ASMR]</h2>
        <div className="flex items-center justify-center gap-2 md:gap-5">
          <MagnifyingGlassIcon height={25} width={25} color="white" />
          {user.isSignedIn ? (
            <UserButton afterSignOutUrl="/sign-in" />
          ) : (
            <SignInButton afterSignInUrl="/" />
          )}
        </div>
      </div>
      <div>{data?.map((post) => <UserPost key={post.id} post={post} />)}</div>
    </div>
  );
}

Home.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
