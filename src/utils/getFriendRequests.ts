import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export type FriendRequest = {
  id: string;
  fromUserId: string;
  username: string;
  avatarUrl: string | null;
  createdAt: string;
};

export async function getFriendRequests(accessToken: string): Promise<FriendRequest[]> {
  const res = await fetch(`${API_URL}/api/profile/friendrequests`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load friend requests");
  }

  return res.json();
}
