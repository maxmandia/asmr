import Layout from "~/components/Layout";
import { api } from "~/lib/utils/api";
import UserPostsContainer from "~/components/UserPostsContainer";

export default function Home() {
  const { data, isLoading, isError } = api.posts.getAll.useQuery();

  if (isLoading || isError) {
    return null;
  }

  return (
    <div className="h-[calc(100vh_-_56px)] overflow-y-scroll px-5  md:w-[50%] md:p-0">
      <UserPostsContainer data={data} />
    </div>
  );
}

Home.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};
