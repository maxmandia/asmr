import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const waitlistsRouter = createTRPCRouter({
  addUserToWaitlist: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const waitlist = await ctx.db.waitlist.create({
        data: {
          email: input.email,
        },
      });
      return waitlist;
    }),
});
