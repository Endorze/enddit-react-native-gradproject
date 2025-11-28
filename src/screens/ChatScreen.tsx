import { View, Text, FlatList, TextInput, Pressable } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMessages, Message } from "../utils/getMessages";
import { sendMessage } from "../utils/sendMessage";
import { useState } from "react";

type RouteParams = {
  friendId: string;
  username: string;
  avatarUrl?: string | null;
};

export function ChatScreen() {
  const { accessToken, user } = useAuth();
  const route = useRoute();
  const { friendId, username } = route.params as RouteParams;
  const [text, setText] = useState("");

  const {
    data: messages = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Message[]>({
    queryKey: ["messages", friendId],
    queryFn: () => getMessages(friendId, accessToken!),
    enabled: !!accessToken && !!friendId,
    refetchInterval: 1000,
  });

  const sendMutation = useMutation({
    mutationFn: () =>
      sendMessage({ friendId, content: text, accessToken: accessToken! }),
    onSuccess: () => {
      setText("");
      refetch();
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-white">Loading chat…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-4">
        <Text className="text-red-400">Failed to load messages.</Text>
      </View>
    );
  }

  const myId = user?.id;

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 pt-6 pb-3 border-b border-gray-700">
        <Text className="text-white text-xl font-semibold">
          Chat with {username}
        </Text>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => {
          const isMe = item.sender_id === myId;
          return (
            <View
              className={`mb-2 flex-row ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <View
                className={`max-w-[70%] px-3 py-2 rounded-2xl ${
                  isMe ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                <Text className="text-white">{item.content}</Text>
              </View>
            </View>
          );
        }}
      />

      {/* Input */}
      <View className="flex-row items-center px-3 py-2 border-t border-gray-700 mb-20">
        <TextInput
          placeholder="Type a message..."
          placeholderTextColor="#9CA3AF"
          value={text}
          onChangeText={setText}
          className="flex-1 bg-card text-white px-3 py-2 rounded-xl mr-2"
        />
        <Pressable
          onPress={() => {
            if (!text.trim() || sendMutation.isPending) return;
            sendMutation.mutate();
          }}
          className="px-3 py-2 bg-blue-600 rounded-xl disabled:opacity-50"
          disabled={sendMutation.isPending || !text.trim()}
        >
          <Text className="text-white font-semibold">Send</Text>
        </Pressable>
      </View>
    </View>
  );
}
