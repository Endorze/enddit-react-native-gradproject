import { View, Text, ActivityIndicator, FlatList, TextInput, Image, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getFriends, Friend } from "../utils/getFriends";
import { useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { getAvatarUrl } from "../utils/profileUtils/getAvatarUrl";
import { AuthorAvatar } from "../components/AuthorAvatar/AuthorAvatar";

export function FriendScreen() {
  const { accessToken } = useAuth();
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState("");
  const isFocused = useIsFocused();

  const {
    data: friends = [],
    isLoading,
    error,
  } = useQuery<Friend[]>({
    queryKey: ["friends"],
    queryFn: () => getFriends(accessToken!),
    enabled: !!accessToken,
    refetchInterval: isFocused ? 10000 : false,
  });

  const filtered = friends.filter((f) =>
    f.username.toLowerCase().startsWith(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
        <Text className="text-white mt-2">Loading friends…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-red-400">Failed to load friends.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-4 pt-6">
      <Text className="text-2xl font-bold mb-4">Chats</Text>

      <TextInput
        placeholder="Search in Enddit"
        placeholderTextColor="#9CA3AF"
        value={search}
        onChangeText={setSearch}
        className="w-full bg-gray-300 text-white px-4 py-2 mb-4"
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
                className="flex-row items-center bg-gray-300  px-4 py-3 mb-3"
              >
                <View className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden items-center justify-center mr-3">
                  {avatarUrl && (
                    <View>
                      <AuthorAvatar userId={item.userId} username={item.username} />
                    </View>
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
