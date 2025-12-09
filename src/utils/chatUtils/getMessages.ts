import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};

export async function getMessages(friendId: string, accessToken: string): Promise<Message[]> {
  const res = await fetch(`${API_URL}/api/chat/${friendId}/messages`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error("Failed to load messages");
  }

  return res.json();
}
