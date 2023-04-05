import superjson from 'superjson';
import { appRouter } from './../server/api/root';
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { prisma } from '@/server/db';
import { type Post } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export function generateSSGHelper() {

  return createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjson
  });
}

export type PostWithAuthor = ReturnType<typeof addUserDataToPost>;

export async function addUserDataToPost(posts: Post[]) {
  const users = await prisma.user.findMany();

  return posts.map((post) => {
    const author = users.find((user) => user.id === post.authorId);

    if (!author) {
      console.error("AUTHOR NOT FOUND", post);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.authorId}`,
      });
    }

    return {
      post,
      author: {
        ...author
      }
    };
  });
}