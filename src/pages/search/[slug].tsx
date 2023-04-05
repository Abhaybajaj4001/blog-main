import LoadingSpinner from "@/components/loading-spinner";
import PageLayout from "@/components/page-layout";
import PostView from "@/components/post-view";
import TitleBar from "@/components/title-bar";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

const SearchPage = () => {
  const router = useRouter();
  const { slug: query } = router.query;

  const { data, isLoading } = api.posts.searchPosts.useQuery({
    searchQuery: query as string,
  });

  if (isLoading) {
    return <LoadingSpinner size={80} />;
  }

  if (data?.length === 0) {
    return (
      <PageLayout size="screen">
        <TitleBar />
        <div className="mt-64 flex w-full items-center justify-center text-2xl">
          <span className="text-white">No results found :/</span>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout size="screen">
      <TitleBar />
      {data?.map((post) => {
        return <PostView key={post.id} post={post} />;
      })}
    </PageLayout>
  );
};

export default SearchPage;
