import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  findUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      return user;
    }),
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        id: ctx.auth.userId,
      },
      select: {
        profile_header_url: true,
        profile_picture_url: true,
        name: true,
        handle: true,
        stripe_customer_id: true,
        id: true,
      },
    });

    return user;
  }),
  updateUserProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        profile_picture_url: z.string().optional(),
        profile_header_url: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.update({
          where: {
            id: ctx.auth.userId,
          },
          data: {
            name: input.name,
            profile_picture_url: input.profile_picture_url,
            profile_header_url: input.profile_header_url,
          },
        });

        return user;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
    }),
  searchUsers: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      if (input.query === "") {
        const users = await ctx.db.user.findMany({
          where: {
            id: {
              not: ctx.auth.userId,
            },
          },
          select: {
            name: true,
            id: true,
            profile_picture_url: true,
            handle: true,
            subscriptionSetting: true,
          },
          orderBy: {
            followers: {
              _count: "desc",
            },
          },
          take: 10,
        });

        return users;
      } else {
        const users = await ctx.db.user.findMany({
          where: {
            name: {
              contains: input.query,
            },
            id: {
              not: ctx.auth.userId,
            },
          },
          select: {
            name: true,
            id: true,
            profile_picture_url: true,
            handle: true,
            subscriptionSetting: true,
          },
        });

        return users;
      }
    }),
  validateHandle: publicProcedure
    .input(z.object({ handle: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          handle: input.handle,
        },
      });

      if (user) {
        return true;
      }

      return false;
    }),
  doesEmailAlreadyExist: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (user) {
        return true;
      }

      return false;
    }),
  hasCompletedSubscriptionOnboarding: protectedProcedure.query(
    async ({ ctx }) => {
      try {
        const subscriptionSetting = await ctx.db.subscriptionSetting.findUnique(
          {
            where: {
              userId: ctx.auth.userId,
            },
          },
        );

        if (subscriptionSetting && subscriptionSetting.isComplete) {
          return true;
        }

        return false;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
    },
  ),
});
