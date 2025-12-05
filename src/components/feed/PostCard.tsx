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
  const { user } = useAuth();

  const currentUserId = user?.id;
  const isOwner = currentUserId === post.user_id;

  const [likesCount, setLikesCount] = useState(post.likesCount ?? 0);
  const [liked, setLiked] = useState(!!post.likedByCurrentUser);
  const [isToggling, setIsToggling] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

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

  const handleDeletePost = () => {
    console.log("tried to delete post")
    setMenuVisible(false);
    // TODO: din delete-logik här (t.ex. kalla DELETE /api/posts/:id + invalidation)
  };

  const handleReportPost = () => {
    console.log("tried to report post.")
    setMenuVisible(false);
    // TODO: din report-logik här (t.ex. öppna modal eller POST /api/posts/:id/report)
  };

  return (
    <View className="mb-3 min-w-full border-top shadow-sm bg-white">
      <View className="p-4 flex flex-col">
        <View className="flex flex-row items-center justify-between">
          {/* Vänster: avatar + username */}
          <View className="flex flex-row items-center gap-2 flex-1">
            <AuthorAvatar userId={post.user_id} username={post.username} />
            <Text className="text-black text-2xl font-semibold">
              {post.username}
            </Text>
          </View>
          <View className="relative">
            <Pressable
              onPress={() => setMenuVisible((v) => !v)}
              className="p-2 rounded-full"
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <FontAwesome name="ellipsis-v" size={18} color="#6b7280" />
            </Pressable>

            {menuVisible && (
              <>
                <Pressable
                  onPress={() => setMenuVisible(false)}
                  className="absolute inset-0"
                  style={{ position: "absolute", top: 0, left: -3000, right: 0, bottom: 0, width: 5000, height: 5000 }}
                />

                <View className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-10">
                  {isOwner ? (
                    <Pressable
                      onPress={() => {
                        setMenuVisible(false);
                        handleDeletePost()
                      }}
                      className="px-4 py-3 flex-row items-center"
                      style={({ pressed }) => [
                        { backgroundColor: pressed ? "#f3f4f6" : "transparent" },
                      ]}
                    >
                      <FontAwesome name="trash-o" size={16} color="#ef4444" />
                      <Text className="ml-2 text-red-500 font-medium">Delete post</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => {
                        setMenuVisible(false);
                        handleReportPost()
                      }}
                      className="px-4 py-3 flex-row items-center"
                      style={({ pressed }) => [
                        { backgroundColor: pressed ? "#f3f4f6" : "transparent" },
                      ]}
                    >
                      <FontAwesome name="flag-o" size={16} color="#f97316" />
                      <Text className="ml-2 text-orange-500 font-medium">Report post</Text>
                    </Pressable>
                  )}
                </View>
              </>
            )}
          </View>

        </View>

        <Text className="text-muted mt-2">{post.content}</Text>
      </View>

      {post.image && (
        <Image
          source={{ uri: post.image }}
          className="w-full h-80"
          resizeMode="cover"
        />
      )}

      <View className="flex-row items-center justify-between px-4 py-2">
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
