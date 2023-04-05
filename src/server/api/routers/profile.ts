import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({
      username: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          name: input.username
        }
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      return user;
    }),
  getUserByUserId: publicProcedure
    .input(z.object({
      userId: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId
        }
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found"
        });
      }

      return user;
    }),
  makeAdmin: protectedProcedure
    .input(z.object({
      id: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: {
          id: input.id
        },
        data: {
          role: "ADMIN"
        }
      });

      return updatedUser
    }),
  makeAuthor: protectedProcedure
    .input(z.object({
      id: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: {
          id: input.id
        },
        data: {
          role: "AUTHOR"
        }
      });

      return updatedUser
    }),
  getPostByUser: publicProcedure
    .input(z.object({
      userId: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: {
          authorId: input.userId
        },
        orderBy: {
          createdAt: "desc"
        }
      });

      return posts;
    }),
  getAllUsers: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.user.findMany();
    })
})