import Constants from "expo-constants";
import { CommentForPost } from "../types/commentlist";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export async function getCommentsForPost(postId: number): Promise<CommentForPost[]> {
  const res = await fetch(`${API_URL}/api/posts/${postId}/comments`);

  if (!res.ok) {
    throw new Error("Failed to load comments");
  }

  return res.json();
}
