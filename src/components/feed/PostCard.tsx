import { View, Text, Image, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Post } from "../../types/post";
import { AuthorAvatar } from "../AvatarImage/avatarImage";
import { useQuery } from "@tanstack/react-query";
import { getCommentsForPost } from "../../utils/getPostComments";
import CommentsList from "./CommentList";
import { CommentForPost } from "../../types/commentlist";
import { useToggleLike } from "../../utils/toggleLike";
import { useAuth } from "../../context/AuthContext";
import CommentSection from "../CommentSection/CommentSection";

export function PostCard({ post }: { post: Post }) {
  const { data: comments } = useQuery<CommentForPost[]>({
    queryKey: ["comments", post.id],
    queryFn: () => getCommentsForPost(post.id),
  });

  const toggleLikeOnServer = useToggleLike(post.id);
  const currentUserId = useAuth();

  const [likesCount, setLikesCount] = useState(post.likesCount ?? 0);
  const [liked, setLiked] = useState(!!post.likedByCurrentUser);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleLike = async () => {
    if (isToggling) return;
    setIsToggling(true);

    const nextLiked = !liked;

    setLiked(nextLiked);
    setLikesCount((prev) => prev + (nextLiked ? 1 : -1));

    try {
      await toggleLikeOnServer();
    } catch (err) {
      console.warn("Failed to toggle like", err);

      setLiked(liked);
      setLikesCount((prev) => prev + (nextLiked ? -1 : 1));
    } finally {
      setIsToggling(false);
    }
  };

  

  return (
    <View className="mb-3 rounded-xl bg-card p-4">
      <View>
        <AuthorAvatar userId={post.user_id} />
        <Text className="text-white text-2xl font-semibold">
          {post.username}
        </Text>
      </View>

      <Text className="text-lg text-white font-semibold mb-1">
        {post.title}
      </Text>

      {post.image && (
        <Image
          source={{ uri: post.image }}
          className="w-full h-48 rounded-lg mb-2"
          resizeMode="cover"
        />
      )}

      <Text className="text-muted">{post.content}</Text>

      <Text className="text-white mt-1">
        {likesCount} {likesCount === 1 ? "like" : "likes"}
      </Text>

      {comments && <CommentSection postId={post.id} />}

      <View className="mt-2 flex-row items-center justify-between">
        <Pressable
          onPress={handleToggleLike}
          disabled={isToggling}
          className="flex-row items-center"
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <FontAwesome
            name={liked ? "thumbs-up" : "thumbs-o-up"}
            size={20}

            color={liked ? "#3b82f6" : "#9ca3af"}
          />
          <Text className={`ml-2 ${liked ? "text-blue-400" : "text-gray-200"}`}>
            {liked ? "Liked" : "Like"}
          </Text>
        </Pressable>

        <Text className="text-gray-300">
          {likesCount} {likesCount === 1 ? "like" : "likes"}
        </Text>
      </View>
    </View>
  );
}
