import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export async function sendMessage({
  friendId,
  content,
  accessToken,
}: {
  friendId: string;
  content: string;
  accessToken: string;
}) {
  const res = await fetch(`${API_URL}/api/chat/${friendId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Failed to send message");
  }

  return res.json();
}
