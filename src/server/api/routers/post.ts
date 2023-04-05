import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const postsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      content: z.string(),
      image: z.string().nullish(),
    }))
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.session.user.id;

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          title: input.title,
          content: input.content,
          imageData: input.image,
        }
      });

      return post;
    }),
  getAll: publicProcedure
    .input(z.object({
      limit: z.number(),
      cursor: z.string().nullish(),
      skip: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor } = input;

      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc"
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }

      return {
        posts,
        nextCursor
      };
    }),
  // allPosts: publicProcedure
  //   .query(async ({ ctx }) => {
  //     return await ctx.prisma.post.findMany();
  //   }),
  getById: publicProcedure
    .input(z.object({
      postId: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.postId
        }
      });

      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return post;
    }),
  deleteById: protectedProcedure
    .input(z.object({
      postId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const deletedPost = await ctx.prisma.post.delete({
        where: {
          id: input.postId
        }
      });

      return deletedPost;
    }),
  searchPosts: publicProcedure
    .input(z.object({
      searchQuery: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const posts = ctx.prisma.post.findMany({
        where: {
          title: {
            contains: input.searchQuery
          }
        }
      });

      return posts;
    })
});