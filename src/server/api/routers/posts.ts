import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.post.findMany({
      include: {
        user: true,
      },
      where: {
        isPaid: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  getAllFollowingPosts: protectedProcedure.query(async ({ ctx }) => {
    try {
      const followedUsersPosts = await ctx.db.user.findUnique({
        where: {
          id: ctx.auth.userId,
        },
        include: {
          following: {
            include: {
              following: {
                include: {
                  posts: {
                    take: 10, // Limit the number of posts
                    skip: 0, // Skip posts for pagination
                    orderBy: {
                      createdAt: "desc",
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!followedUsersPosts) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Extracting the paginated posts
      const posts = followedUsersPosts.following.flatMap((follow) =>
        follow.following.posts.map((post) => ({
          ...post,
          user: follow.following,
        })),
      );

      return posts;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
    // return posts;
  }),
  getPostsFromUser: protectedProcedure
    .input(z.object({ handle: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          handle: input.handle,
        },
        include: {
          _count: {
            select: { followers: true },
          },
          subscriptionSetting: true,
          subscriber: {
            where: {
              subscriberId: ctx.auth.userId,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const posts = await ctx.db.post.findMany({
        where: {
          userId: user.id,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const isFollowing = await ctx.db.follow.findFirst({
        where: {
          followerId: ctx.auth.userId,
          followingId: user.id,
        },
      });

      const currentUser = await ctx.db.user.findUnique({
        where: {
          id: ctx.auth.userId,
        },
      });

      if (ctx.auth.userId === user.id) {
        return {
          user: { ...user, isMe: true, isFollowing: false },
          currentUser,
          posts,
        };
      } else {
        return {
          user: {
            ...user,
            isMe: false,
            isFollowing: isFollowing ?? false,
            subscriber: user.subscriber.length > 0 ? user.subscriber[0] : null,
          },
          currentUser,
          posts,
        };
      }
    }),
  create: protectedProcedure
    .input(
      z.object({
        caption: z.string(),
        video: z.string().optional(),
        image: z.string().optional(),
        fileKey: z.string().optional(),
        isPaid: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.create({
        data: {
          userId: ctx.auth.userId,
          caption: input.caption,
          image: input.image,
          video: input.video,
          fileKey: input.fileKey,
          isPaid: input.isPaid,
        },
      });
      return post;
    }),
});
