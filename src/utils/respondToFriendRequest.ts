import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export async function respondToFriendRequest({
  requestId,
  accept,
  accessToken,
}: {
  requestId: string;
  accept: boolean;
  accessToken: string;
}) {
  const res = await fetch(
    `${API_URL}/api/profile/friendrequests/${requestId}/respond`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ accept }),
    }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Failed to respond to friend request");
  }

  return res.json();
}
