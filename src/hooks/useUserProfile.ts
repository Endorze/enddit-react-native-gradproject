import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../utils/profileUtils/getUserProfile";

export function useUserProfile(accessToken?: string | null) {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile(accessToken!),
    enabled: !!accessToken,
  });
}
