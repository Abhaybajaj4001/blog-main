import LoadingSpinner from "@/components/loading-spinner";
import PageLayout from "@/components/page-layout";
import TitleBar from "@/components/title-bar";
import { generateSSGHelper } from "@/lib/helpers";
import { api } from "@/utils/api";
import { type NextPage, type GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { type MouseEvent } from "react";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") {
    throw new Error("No ID");
  }

  await ssg.posts.getById.prefetch({ postId: id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      postId: id,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const SinglePostView: NextPage<{ postId: string }> = ({ postId }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { data, isLoading } = api.posts.getById.useQuery({ postId });

  if (!data) {
    return <div>404</div>;
  }

  const { data: author } = api.profile.getUserByUserId.useQuery({
    userId: data?.authorId,
  });

  const { mutate, isLoading: isDeleting } = api.posts.deleteById.useMutation({
    onSuccess: () => {
      router.push("/").catch((err) => console.error(err));
    },
  });

  if (isLoading || isDeleting) {
    return <LoadingSpinner />;
  }

  const canDelete =
    session?.user.role === "ADMIN" ||
    (session?.user.role === "AUTHOR" && session.user.id === data.authorId);

  function handleDelete(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    mutate({ postId });
  }

  return (
    <>
      <Head>
        <title>{`${data.title}`}</title>
      </Head>
      <PageLayout size="screen">
        <TitleBar />
        <div className="mt-2 flex items-center justify-between border-b-[3px] border-amber-500 p-4">
          <h1 className="text-4xl font-bold ">{data.title}</h1>
          <div className="flex items-center gap-x-4">
            {canDelete && (
              <div>
                <button
                  onClick={(e) => handleDelete(e)}
                  className="rounded bg-red-600 px-2 py-1 font-bold"
                >
                  Delete
                </button>
              </div>
            )}
            <Image
              src={author?.image as string}
              alt={"author-image"}
              height={56}
              width={56}
              className="rounded-full ring-2 ring-amber-500"
            />
          </div>
        </div>
        <div className="gap-y-8 p-4 text-xl">
          <div dangerouslySetInnerHTML={{ __html: data.content }} />
          {data.imageData && (
            <div>
              <Image
                className="mt-5 w-1/2"
                src={data.imageData}
                alt={"image"}
                width={150}
                height={150}
              />
            </div>
          )}
        </div>
      </PageLayout>
    </>
  );
};

export default SinglePostView;
