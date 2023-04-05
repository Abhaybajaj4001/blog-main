import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import SignOutMenu from "../sign-out-menu";
import { useState, type MouseEvent } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const TitleBar = () => {
  // const router = useRouter();
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  // const { data, isLoading } = api.posts.searchPosts.useQuery({ searchQuery });

  function handleSignIn(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    signIn().catch((err) => console.error(err));
  }

  function handleRouteToCreate(e: MouseEvent<HTMLAnchorElement>): void {
    if (status === "unauthenticated") {
      toast.error("Please Sign In First!");
      e.preventDefault();
      return;
    }
  }

  function handleSearch(
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ): void {
    e.preventDefault();
    router.push(`/search/${searchQuery}`).catch((err) => console.error(err));
  }

  return (
    <>
      <div className="flex items-center gap-x-3 border-b-[3px] border-amber-600 p-2">
        {session ? (
          <>
            <SignOutMenu userName={session.user.name as string} />
            <Link href={`/${session.user.name as string}`}>
              <Image
                src={session.user.image as string}
                alt="user-image"
                height={56}
                width={56}
                className="h-14 w-14 cursor-pointer rounded-full ring-2 ring-amber-500"
                // onClick={}
              />
            </Link>
          </>
        ) : (
          <div className="relative">
            <button
              onClick={(e) => handleSignIn(e)}
              className="rounded bg-amber-500 p-2 font-bold text-white transition-all hover:bg-amber-200"
            >
              LOGIN
            </button>
          </div>
        )}
        <div className="grow">
          <input
            type="text"
            className="w-full grow rounded p-2 text-black outline-none"
            placeholder="Search posts"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={(e) => handleSearch(e)}
            className="rounded bg-amber-500 p-2 font-bold text-white transition-all hover:bg-amber-200"
          >
            SEARH POSTS!
          </button>
        </div>
        <div>
          <Link
            href="/create"
            onClick={(e) => handleRouteToCreate(e)}
            className="rounded bg-amber-800 p-2 font-bold text-white transition-all hover:bg-amber-200"
          >
            CREATE POST!
          </Link>
        </div>
      </div>
    </>
  );
};

export default TitleBar;
