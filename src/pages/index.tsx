import { useUser } from "@clerk/nextjs";
import Layout from "~/components/Layout";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
export default function Home() {
  const user = useUser();

  if (!user.isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-between px-5 py-7">
      <div>[ASMR]</div>
      <div className="flex items-center justify-center">
        <MagnifyingGlassIcon height={25} width={25} color="white" />
      </div>
    </div>
  );
}

Home.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
