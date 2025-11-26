// LikeButton.native.tsx
import { useState } from "react";
import { Text, Pressable } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { FontAwesome } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useAuth } from "../../context/AuthContext";

const API_URL = Constants.expoConfig?.extra?.API_URL;

type LikeButtonProps = {
  postId: number;
  initialLiked: boolean;
  likeCount: number;
};

export function LikeButton({ postId, initialLiked, likeCount }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [count, setCount] = useState(likeCount);

  const { accessToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/api/posts/${postId}/likes/toggle`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to toggle like");
      // should be { liked: boolean, likesCount: number }
      return res.json();
    },
    onMutate: async () => {
      // 💡 use functional update so we don't rely on stale isLiked
      setIsLiked((prev) => {
        const next = !prev;
        setCount((prevCount) => prevCount + (next ? 1 : -1));
        return next;
      });
    },
    onError: () => {
      // rollback to initial props if something went wrong
      setIsLiked(initialLiked);
      setCount(likeCount);
    },
    onSuccess: (data: { liked?: boolean; likesCount?: number }) => {
      // sync with server truth if needed
      if (typeof data.liked === "boolean") {
        setIsLiked(data.liked);
      }
      if (typeof data.likesCount === "number") {
        setCount(data.likesCount);
      }
    },
  });

  return (
    <Pressable
      onPress={() => mutation.mutate()}
      disabled={mutation.isPending}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <FontAwesome
        name="thumbs-up"
        size={20}
        color={isLiked ? "#3b82f6" : "#9ca3af"} // blue when liked
      />
      <Text
        style={{
          marginLeft: 8,
          color: isLiked ? "#3b82f6" : "#ffffff",
        }}
      >
        {count > 0 ? count : ""}
      </Text>
    </Pressable>
  );
}
