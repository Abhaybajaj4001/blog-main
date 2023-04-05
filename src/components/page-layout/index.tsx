/* eslint-disable @typescript-eslint/no-explicit-any */
const PageLayout = ({ children, size }: { children: any; size: string }) => {
  return (
    <main className="flex justify-center">
      <div
        className={`h-${
          size
        }  w-full border-x-[3px] border-amber-600 md:max-w-2xl`}
      >
        {children}
      </div>
    </main>
  );
};

export default PageLayout;
