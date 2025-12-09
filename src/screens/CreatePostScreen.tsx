import { useState } from "react";
import { View, TextInput, Button, Image, Text, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";
import Constants from "expo-constants";
import { getUserProfile } from "../utils/profileUtils/getUserProfile";
import { useQuery } from "@tanstack/react-query";
import { AuthorAvatar } from "../components/AuthorAvatar/AuthorAvatar";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { pickImage } from "../utils/pickImage";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export function CreatePostScreen() {
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { accessToken, } = useAuth();
  const navigation = useNavigation<any>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["createpost"],
    queryFn: () => getUserProfile(accessToken!),
    enabled: !!accessToken,
  })

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading profile…</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Failed to load profile.</Text>
      </View>
    );
  }


  const submitPost = async () => {
    const form = new FormData();
    form.append("content", content);

    if (imageUri) {
      const filename = imageUri.split("/").pop() || "image.jpg";
      const type = "image/jpeg";

      form.append("image", {
        uri: imageUri,
        name: filename,
        type,
      } as any);
    }
    const res = await fetch(`${API_URL}/api/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    });
    setImageUri(null),
      navigation.navigate("Feed")
  };

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top", "left", "right"]}>
      <View className="relative flex flex-col w-full justify-between flex-1"> 
        <View className="flex flex-col flex-1">
          <View className="flex flex-row items-center gap-2 mt-10 px-4">
            <AuthorAvatar userId={data.userId} username={data.username} />
            <Text>{data.username}</Text>
          </View>
          <TextInput
            placeholder="What are you up to right now?"
            placeholderTextColor="#9CA3AF"
            value={content}
            onChangeText={setContent}
            className="mt-5 flex-1 bg-white shadow-sm text-black px-4 py-3"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <View className="w-full bg-gray-200">
            <Pressable
              onPress={() => pickImage(setImageUri)}
              className="mt-4 mb-4 ml-4"
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <Ionicons name="image" size={32} color="#3b82f6" />
              <Text>Add Image</Text>
            </Pressable>
          </View>

        </View>

          {imageUri && (
            <View className="bg-gray-200 flex-1">
              <Image
                source={{ uri: imageUri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          )}

        <Pressable
          onPress={submitPost}
          className="bg-blue-600 py-4 w-full items-center"
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <Text className="text-white font-bold text-lg">Post</Text>
        </Pressable> 

      </View>
    </SafeAreaView>
  );
}
