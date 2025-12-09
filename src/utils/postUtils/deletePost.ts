import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export async function deletePost({
  postId,
  accessToken,
}: { postId: number; accessToken: string | null }) {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_URL}/api/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    console.error("Failed to delete post", body);
    throw new Error(body?.message ?? "Failed to delete post");
  }

  return res.json();
}
