import { View, Text, ActivityIndicator, FlatList, TextInput, Image, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getFriends, Friend } from "../utils/getFriends";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { getAvatarUrl } from "../utils/getAvatarUrl";

export function FriendScreen() {
  const { accessToken } = useAuth();
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState("");

  const {
    data: friends = [],
    isLoading,
    error,
  } = useQuery<Friend[]>({
    queryKey: ["friends"],
    queryFn: () => getFriends(accessToken!),
    enabled: !!accessToken,
  });

  const filtered = friends.filter((f) =>
    f.username.toLowerCase().startsWith(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
        <Text className="text-white mt-2">Loading friends…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-4">
        <Text className="text-red-400">Failed to load friends.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4 pt-6">
      <Text className="text-2xl text-white font-bold mb-4">Chats</Text>

      <TextInput
        placeholder="Search in Enddit"
        placeholderTextColor="#9CA3AF"
        value={search}
        onChangeText={setSearch}
        className="w-full bg-card text-white px-4 py-2 rounded-xl mb-4"
      />

      {filtered.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400">No friends found.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.friendshipId}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => {
            // 🧠 bygg avatar-url utifrån userId
            const avatarUrl = getAvatarUrl(String(item.userId));

            return (
              <Pressable
                onPress={() =>
                  navigation.navigate("Chat", {
                    friendId: item.userId,
                    username: item.username,
                    avatarUrl, 
                  })
                }
                className="flex-row items-center bg-card rounded-2xl px-4 py-3 mb-3"
              >
                <View className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden items-center justify-center mr-3">
                  {avatarUrl ? (
                    <Image
                      source={{ uri: avatarUrl }}
                      className="w-12 h-12"
                      resizeMode="cover"
                    />
                  ) : (
                    <Text className="text-white text-xs">No avatar</Text>
                  )}
                </View>
                <Text className="text-white text-lg font-medium">
                  {item.username}
                </Text>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}
