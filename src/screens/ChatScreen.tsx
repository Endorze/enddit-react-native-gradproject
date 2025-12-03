import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMessages, Message } from "../utils/getMessages";
import { sendMessage } from "../utils/sendMessage";
import { getAvatarUrl } from "../utils/getAvatarUrl";

type RouteParams = {
  friendId: string;
  username: string;
  avatarUrl?: string | null;
};

export function ChatScreen() {
  const { accessToken, user } = useAuth();
  const route = useRoute();
  const { friendId, username, avatarUrl: routeAvatarUrl } =
    route.params as RouteParams;

  const [text, setText] = useState("");
  const [friendAvatarError, setFriendAvatarError] = useState(false);
  const [myAvatarError, setMyAvatarError] = useState(false);

  const flatListRef = useRef<FlatList<Message> | null>(null);

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

  const myId = user?.id;

  const friendAvatarUrl =
    routeAvatarUrl ?? getAvatarUrl(String(friendId)) ?? null;
  const myAvatarUrl = user?.id ? getAvatarUrl(String(user.id)) : null;
  const defaultAvatar = require("../../assets/default-avatar.png");

  useEffect(() => {
    if (!messages.length) return;
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

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

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View className="flex-1">
          <View className="px-4 pt-6 pb-3 border-b border-gray-400 flex-row items-center">
            <View className="w-9 h-9 rounded-full bg-gray-700 overflow-hidden mr-3 items-center justify-center">
              <Image
                source={
                  friendAvatarError || !friendAvatarUrl
                    ? defaultAvatar
                    : { uri: friendAvatarUrl }
                }
                className="w-9 h-9"
                resizeMode="cover"
                onError={() => setFriendAvatarError(true)}
              />
            </View>
            <Text className="text-black text-xl font-semibold">
              {username}
            </Text>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 12 }}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }}
            renderItem={({ item }) => {
              const isMe = item.sender_id === myId;

              const avatarSource = isMe
                ? myAvatarError || !myAvatarUrl
                  ? defaultAvatar
                  : { uri: myAvatarUrl }
                : friendAvatarError || !friendAvatarUrl
                ? defaultAvatar
                : { uri: friendAvatarUrl };

              return (
                <View
                  className={`mb-2 flex-row items-end ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isMe && (
                    <Image
                      source={avatarSource}
                      className="w-8 h-8 rounded-full mr-2"
                      resizeMode="cover"
                      onError={() => setFriendAvatarError(true)}
                    />
                  )}

                  <View
                    className={`max-w-[70%] px-3 py-2 rounded-2xl ${
                      isMe ? "bg-blue-600" : "bg-gray-400"
                    }`}
                  >
                    <Text className="text-white">{item.content}</Text>
                  </View>

                  {isMe && (
                    <Image
                      source={avatarSource}
                      className="w-8 h-8 rounded-full ml-2"
                      resizeMode="cover"
                      onError={() => setMyAvatarError(true)}
                    />
                  )}
                </View>
              );
            }}
          />

          <View className="flex-row items-center px-3 py-2">
            <TextInput
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              value={text}
              onChangeText={setText}
              className="flex-1 bg-gray-300 text-white px-3 py-2 rounded-xl mr-2"
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
