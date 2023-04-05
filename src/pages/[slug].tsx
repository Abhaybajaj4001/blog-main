import { api } from "@/utils/api";
import Head from "next/head";
import PageLayout from "@/components/page-layout";
import Image from "next/image";
import { useRouter } from "next/router";
import { type NextPage } from "next";
import { type MouseEvent } from "react";
import { signOut, useSession } from "next-auth/react";
import LoadingSpinner from "@/components/loading-spinner";
import PostView from "@/components/post-view";

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const { slug: username } = router.query;
  const { data: session } = useSession();
  const { mutate } = api.profile.makeAdmin.useMutation();
  const { data } = api.profile.getUserByUsername.useQuery({
    username: username as string,
  });
  const { data: posts, isLoading } = api.profile.getPostByUser.useQuery({
    userId: data?.id as string,
  });
  
  if (!data || isLoading || !posts) {
    return <LoadingSpinner size={80} />;
  }

  function updateUser(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    if (session?.user.role === "ADMIN") {
      mutate({ id: data?.id as string });
    }
  }

  function handleSignOut(): void {
    if (session?.user.id === data?.id) {
      signOut().catch((err) => console.error(err));
    }
  }

  return (
    <>
      <Head>
        <title>{data.name}</title>
      </Head>

      <PageLayout size="full">
        <div className="relative h-36 bg-amber-600">
          <Image
            onClick={() => handleSignOut()}
            src={data.image ?? ""}
            alt={`${username as string}'s profile pic`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
          />
        </div>
        <div className="h-[64px]" />
        <div className="flex items-center gap-x-10 p-4 text-2xl font-bold">
          {`@${username as string}`}
          {data.role === "ADMIN" && session?.user.role !== "ADMIN" && (
            <button
              className="rounded bg-amber-500 p-2"
              onClick={(e) => updateUser(e)}
            >
              Make admin
            </button>
          )}
          <div className="rounded bg-gray-200 p-1 text-sm font-normal tracking-tighter text-black">
            {data.role}
          </div>
        </div>
        <div className="w-full border-b-[3px] border-amber-600" />

        <div>
          {posts.map((post) => {
            return <PostView key={post.id} post={post} />;
          })}
        </div>
      </PageLayout>
    </>
  );
};

export default ProfilePage;
