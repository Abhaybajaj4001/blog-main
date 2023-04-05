import { GoThreeBars } from "react-icons/go";
import { signOut } from "next-auth/react";

const SignOutMenu = ({ userName }: { userName: string }) => {
  
  function handleSignOut(): void {
    signOut().catch((err) => console.error(err));
  }

  return (
    <div
      className="group relative inline-block cursor-pointer rounded-full p-2 text-left text-slate-400 transition-all hover:ring-2 hover:ring-slate-400"
      tabIndex={-1}
    >
      <span>
        <GoThreeBars className="focus-within:border-transparent focus-within:outline focus-within:outline-2 focus-within:outline-slate-400" />
      </span>
      <div className="invisible origin-top-right -translate-y-2 scale-95 transform cursor-default opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100">
        <div
          className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-slate-600 rounded-md border border-slate-600 bg-neutral-700 shadow-lg outline-none"
          role="menu"
        >
          <div className="px-4 py-3">
            <p className="text-sm leading-5">Signed in as</p>
            <p className="mt-2 truncate text-lg font-bold leading-5">
              {userName}
            </p>
          </div>

          <div className="py-1">
            <button
              className="flex w-full justify-between px-4 py-2 text-left text-sm font-bold leading-5 text-slate-400 focus-visible:outline-1 focus-visible:outline-blue-500"
              role="menuitem"
              onClick={() => handleSignOut()}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignOutMenu;
