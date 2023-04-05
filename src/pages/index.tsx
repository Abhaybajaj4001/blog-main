import Feed from "@/components/feed";
import PageLayout from "@/components/page-layout";
import TitleBar from "@/components/title-bar";
import { api } from "@/utils/api";

export default function Home() {
  api.posts.getAll.useInfiniteQuery({ limit: 5 });

  return (
    <PageLayout size="screen">
      <TitleBar />
      <Feed />
    </PageLayout>
  );
}
