import { TRPCError } from "@trpc/server";
import axios from "axios";
import { z } from "zod";
import { prisma } from "~/config/prisma";
import { logError } from "~/lib/helpers/log-error";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.post.findMany({
      include: {
        user: {
          select: {
            name: true,
            profile_picture_url: true,
            id: true,
            handle: true,
          },
        },
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
          subscribedTo: true,
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

      const subscribedUsers = await ctx.db.subscription.findMany({
        where: {
          subscriberId: ctx.auth.userId,
        },
      });

      if (!followedUsersPosts) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Extract the IDs from the subscribed users
      const subscribedUserIds = subscribedUsers.map(
        (user) => user.subscribedToId,
      );

      // Extracting the paginated posts
      const posts = followedUsersPosts.following.flatMap((follow) =>
        follow.following.posts.map((post) => ({
          ...post,
          user: follow.following,
        })),
      );

      return { posts, subscribedUserIds };
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
          user: {
            include: {
              subscriptionSetting: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const subscribedUsers = await ctx.db.subscription.findMany({
        where: {
          subscriberId: ctx.auth.userId,
        },
      });

      // Extract the IDs from the subscribed users
      const subscribedUserIds = subscribedUsers.map(
        (user) => user.subscribedToId,
      );

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
          subscribedUserIds,
        };
      }
    }),
  getUploadUrl: protectedProcedure.query(async ({ ctx }) => {
    const mux_data = {
      cors_origin: "*",
      new_asset_settings: {
        playback_policy: ["public"],
      },
      test: process.env.NODE_ENV === "development",
    };

    const { data } = await axios.post(
      "https://api.mux.com/video/v1/uploads",
      mux_data,
      {
        auth: {
          username: process.env.MUX_TOKEN_ID!,
          password: process.env.MUX_TOKEN_SECRET!,
        },
      },
    );

    return {
      uploadUrl: data.data.url,
      uploadId: data.data.id,
    };
  }),

  checkAssetStatus: protectedProcedure
    .input(
      z.object({
        uploadId: z.string(),
        caption: z.string().optional(),
        isPaid: z.boolean(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        // check the status of the asset
        const { data } = await axios.get(
          `https://api.mux.com/video/v1/uploads/${input.uploadId}`,
          {
            auth: {
              username: process.env.MUX_TOKEN_ID!,
              password: process.env.MUX_TOKEN_SECRET!,
            },
          },
        );

        // if the asset is created then get the playback id
        if (data.data.status === "asset_created") {
          const { data: assetData } = await axios.get(
            `https://api.mux.com/video/v1/assets/${data.data.asset_id}`,
            {
              auth: {
                username: process.env.MUX_TOKEN_ID!,
                password: process.env.MUX_TOKEN_SECRET!,
              },
            },
          );

          // post the video to the database
          await prisma.post.create({
            data: {
              assetId: data.data.asset_id,
              playbackId: assetData.data.playback_ids[0].id,
              caption: input.caption,
              isPaid: input.isPaid,
              userId: ctx.auth.userId,
            },
          });

          return "success";
        } else {
          // the asset is not ready, so return a message to the client
          return "asset_not_ready";
        }
      } catch (error: any) {
        logError("checkAssetStatus", "Error checking asset status", error);
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error checking asset status",
        });
      }
    }),
});
