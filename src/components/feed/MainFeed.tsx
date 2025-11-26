import { View, Text, ActivityIndicator, FlatList } from "react-native";
import Constants from "expo-constants";
import { useQuery } from "@tanstack/react-query";
import { Post } from "../../types/post";
import { PostCard } from "./PostCard";
import { useAuth } from "../../context/AuthContext";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function MainFeed() {

  const {accessToken} = useAuth();

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/posts/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    

      if (!res.ok) throw new Error("Failed to load posts");
      return res.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-red-400">{message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts ?? []}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => <PostCard post={item} />}
    />
  );
}
