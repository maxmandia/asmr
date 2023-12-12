import { createTRPCRouter } from "~/server/api/trpc";
import { postsRouter } from "./routers/posts";
import { usersRouter } from "./routers/users";
import { waitlistsRouter } from "./routers/waitlists";
import { followsRouter } from "./routers/follows";
import { subscriptionSettingsRouter } from "./routers/subscription-settings";
import { stripeRouter } from "./routers/stripe";
import { messagesRouter } from "./routers/messages";
import { notificationsRouter } from "./routers/notifications";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  posts: postsRouter,
  users: usersRouter,
  waitlists: waitlistsRouter,
  follows: followsRouter,
  subscriptionSettings: subscriptionSettingsRouter,
  stripe: stripeRouter,
  messages: messagesRouter,
  notifications: notificationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
