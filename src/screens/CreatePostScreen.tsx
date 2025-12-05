import { useState } from "react";
import { View, TextInput, Button, Image, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import Constants from "expo-constants";
import { getUserProfile } from "../utils/getUserProfile";
import { useQuery } from "@tanstack/react-query";
import { AuthorAvatar } from "../components/AuthorAvatar/AuthorAvatar";
import { useNavigation } from "@react-navigation/native";

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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: false,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

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
    navigation.navigate("Home")
  };

  return (
    <View>
      <View className="flex flex-row items-center gap-2 mt-10 px-4">
        <AuthorAvatar userId={data.userId} username={data.username} />
        <Text>{data.username}</Text>
      </View>
      <TextInput
        placeholder="What are you up to right now?"
        placeholderTextColor="#9CA3AF"
        value={content}
        onChangeText={setContent}
        className="mt-5 h-40 bg-white shadow-sm text-black px-4 py-3"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {imageUri && (
        <View className="bg-gray-200 w-full items-center justify-center mb-40 p-5">
          <Image source={{ uri: imageUri }} className="w-[120px] h-[120px] object-fill" />
        </View>
      )}

      <Button title="Upload Image" onPress={pickImage} />
      <Button title="Create Post" onPress={submitPost} />
    </View>
  );
}
