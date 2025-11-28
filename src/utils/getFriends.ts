import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export type Friend = {
  friendshipId: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
};

export async function getFriends(accessToken: string): Promise<Friend[]> {
  const res = await fetch(`${API_URL}/api/friends`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error("Failed to load friends");
  }

  return res.json();
}
