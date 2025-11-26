import Constants from "expo-constants";
import { useAuth } from "../context/AuthContext";
import { useCallback } from "react";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export function useToggleLike(postId: number) {
  const { accessToken } = useAuth();

  const toggleLike = async () => {

    const res = await fetch(`${API_URL}/api/posts/${postId}/likes/toggle`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) throw new Error("Failed to toggle like");
    return res.json();

  }

  return useCallback(toggleLike, [postId, accessToken])
}
