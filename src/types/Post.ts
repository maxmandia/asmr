import { RouterOutputs } from "~/lib/utils/api";

export type Post = RouterOutputs["posts"]["getAll"][number];
