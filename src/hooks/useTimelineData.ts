import { useQuery, useMutation } from "react-query";
import axios from "axios";
import type { Post } from "@prisma/client";

type RequiredFields = "userId" | "caption";
type OptionalFields = "video" | "image" | "caption";

type PostInfo = Pick<Partial<Post>, OptionalFields> &
  Pick<Post, RequiredFields>;

function createPost(postInfo: PostInfo) {
  return axios.post(`api/create-post`, postInfo);
}

function fetchTimeline() {
  return axios.get(`api/get-timeline`);
}

export const useTimelineData = (
  onSuccess?: () => void,
  onError?: () => void,
) => {
  return useQuery("timeline", fetchTimeline, {
    onSuccess,
    onError,
  });
};

export const useAddTimelineData = (
  onSuccess?: () => void,
  onError?: () => void,
) => {
  return useMutation(createPost, {
    onSuccess,
    onError,
  });
};
