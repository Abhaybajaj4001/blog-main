/* eslint-disable @typescript-eslint/no-misused-promises */
import { api } from "@/utils/api";
import { useState } from "react";
import LoadingSpinner from "../loading-spinner";
import PostView from "@/components/post-view";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";

const Feed = () => {
  const [page, setPage] = useState(0);
  const { data, fetchNextPage, isLoading } = api.posts.getAll.useInfiniteQuery(
    { limit: 5 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      // initialData: { posts: initialPosts, nextCursor: "" },
    }
  );

  if (isLoading) {
    return <LoadingSpinner size={80} />;
  }

  async function handleFetchNextPage() {
    await fetchNextPage();
    setPage((prev) => prev + 1);
  }

  function handleFetchPreviousPage() {
    setPage((prev) => prev - 1);
  }

  const toShow = data?.pages[page]?.posts;

  if (!toShow) {
    return <div>No Posts Yet</div>;
  }

  return (
    <div className="">
      {toShow.map((post) => {
        return <PostView key={post.id} post={post} />;
      })}
      <div className="mb-3 mt-4 flex items-center justify-center gap-x-5 text-black">
        <button
          onClick={handleFetchPreviousPage}
          className="rounded bg-amber-200 p-2"
          disabled={page === 0}
        >
          <AiOutlineArrowLeft />
        </button>
        <button
          onClick={() => handleFetchNextPage()}
          className="rounded bg-amber-200 p-2"
          disabled={toShow?.length < 5}
        >
          <AiOutlineArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Feed;
