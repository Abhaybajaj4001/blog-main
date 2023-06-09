import { createTRPCRouter } from "@/server/api/trpc";
// import { exampleRouter } from "@/server/api/routers/example";
import { profileRouter } from "./routers/profile";
import { postsRouter } from "./routers/post";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profile: profileRouter,
  posts: postsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
