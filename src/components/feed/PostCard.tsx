import { View, Text, Image, Pressable, Modal } from "react-native";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Post } from "../../types/post";
import { AuthorAvatar } from "../AuthorAvatar/AuthorAvatar";
import { useQuery } from "@tanstack/react-query";
import { getCommentsForPost } from "../../utils/getPostComments";
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
  const [toggleModal, setToggleModal] = useState(false);

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
    <View className="mb-3 w-full border-top shadow-sm bg-white">
      <View className="p-4 flex flex-col">
        <View className="flex flex-row items-center gap-2">
          <AuthorAvatar userId={post.user_id} username={post.username} />
          <Text className="text-black text-2xl font-semibold">
            {post.username}
          </Text>
        </View>

        <Text className="text-lg text-black font-semibold mb-1">
          {post.title}
        </Text>
        <Text className="text-muted">{post.content}</Text>
      </View>

      {post.image && (
        <Image
          source={{ uri: post.image }}
          className="w-full h-80"
          resizeMode="cover"
        />
      )}

      {/* ⛔ Ta bort denna från "vanliga" layouten så den inte gör posten lång */}
      {/* {comments && <CommentSection postId={post.id} />} */}

      <View className="flex-row items-center justify-between px-4 py-2">
        {/* LIKE KNAPP */}
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
            {likesCount}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setToggleModal(true)}
          className="flex-row items-center"
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <FontAwesome name="comment-o" size={20} color="#9ca3af" />
          <Text className="ml-2 text-gray-400">
            {comments?.length ?? 0} kommentarer
          </Text>
        </Pressable>
      </View>

      <Modal
        visible={toggleModal}
        animationType="slide"
        transparent
        onRequestClose={() => setToggleModal(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="h-[100%] bg-white rounded-t-3xl p-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold">Kommentarer</Text>
              <Pressable onPress={() => setToggleModal(false)}>
                <Text className="text-blue-500 font-semibold">Stäng</Text>
              </Pressable>
            </View>

            <CommentSection postId={post.id} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
