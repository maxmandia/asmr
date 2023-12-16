import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: [
    "/sign-in",
    "/api/clerk-webhook",
    "/api/trpc/waitlists.addUserToWaitlist",
    "/api/capture-payment-success",
    "/api/capture-account-updated",
    "/.well-known/apple-developer-merchantid-domain-association",
    "/api/cron/notifications",
    "/api/trpc/users.getUser,posts.getAll",
    "/home",
    "/api/trpc/users.getUser",
  ],
  ignoredRoutes: ["/"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
