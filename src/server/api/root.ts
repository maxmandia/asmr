import { createTRPCRouter } from "~/server/api/trpc";
import { postsRouter } from "./routers/posts";
import { usersRouter } from "./routers/users";
import { waitlistsRouter } from "./routers/waitlists";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  posts: postsRouter,
  users: usersRouter,
  waitlists: waitlistsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
