import { RouterOutputs } from "~/lib/utils/api";

export type SubscribedUsers =
  RouterOutputs["posts"]["getAllFollowingPosts"]["subscribedUserIds"];
