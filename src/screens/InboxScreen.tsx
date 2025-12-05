import { View, Text, ActivityIndicator, FlatList, Image, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getFriendRequests, FriendRequest } from "../utils/getFriendRequests";
import { respondToFriendRequest } from "../utils/respondToFriendRequest";
import { useIsFocused } from "@react-navigation/native";

export function InboxScreen() {
  const { accessToken } = useAuth();
  const isFocused = useIsFocused();

  const {
    data: requests = [],
    isLoading,
    error,
    refetch,
  } = useQuery<FriendRequest[]>({
    queryKey: ["friendRequests"],
    queryFn: () => getFriendRequests(accessToken!),
    enabled: !!accessToken,
    refetchInterval: isFocused ? 10000 : false
  });

  const respondMutation = useMutation({
    mutationFn: ({
      requestId,
      accept,
    }: {
      requestId: string;
      accept: boolean;
    }) => respondToFriendRequest({ requestId, accept, accessToken: accessToken! }),
    onSuccess: () => {
      refetch();
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
        <Text className="text-white mt-2">Loading inbox…</Text>
      </View>
    );
  }

  if (error) {
    console.log(error);
    return (
      <View className="flex-1 items-center justify-center bg-background px-4">
        <Text className="text-red-400">Failed to load friend requests.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4 pt-6">
      <Text className="text-2xl text-white font-bold mb-4">Inbox 👋</Text>

      {requests.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400">No friend requests right now.</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <View className="flex-row items-center bg-card rounded-2xl px-4 py-3 mb-3">
              {/* Avatar */}
              <View className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden items-center justify-center mr-3">
                {item.avatarUrl ? (
                  <Image
                    source={{ uri: item.avatarUrl }}
                    className="w-12 h-12"
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-white text-xs">No avatar</Text>
                )}
              </View>

              <View className="flex-1">
                <Text className="text-white font-semibold">{item.username}</Text>
                <Text className="text-gray-400 text-sm">
                  wants to be your friend
                </Text>
              </View>

              <View className="flex-row gap-2">
                <Pressable
                  onPress={() =>
                    respondMutation.mutate({ requestId: item.id, accept: true })
                  }
                  disabled={respondMutation.isPending}
                  className="px-3 py-1 rounded-lg bg-green-600 disabled:opacity-50"
                >
                  <Text className="text-white text-sm font-semibold">Accept</Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    respondMutation.mutate({ requestId: item.id, accept: false })
                  }
                  disabled={respondMutation.isPending}
                  className="px-3 py-1 rounded-lg bg-red-600 disabled:opacity-50"
                >
                  <Text className="text-white text-sm font-semibold">Decline</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
