import { type Post } from "@prisma/client";
import Link from "next/link";

const PostView = (props: { post: Post }) => {
  const { post } = props;

  return (
    <div className="p-3">
      <Link href={`/post/${post.id}`}>
        <div className="flex items-end justify-between rounded-lg border-4  border-amber-300 p-4">
          <div className="flex grow flex-col">
            <p className="text-xl font-bold">{post.title}</p>
            <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
          </div>
          <div>
            <p className="font-bold">{}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostView;
