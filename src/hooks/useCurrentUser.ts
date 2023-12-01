import { api } from "~/lib/utils/api";

export default function useCurrentUser() {
  return api.users.getUser.useQuery();
}
