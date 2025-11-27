import { useState } from "react";
import { View, TextInput, Button, Image, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { accessToken } = useAuth();

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
    form.append("title", title);
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
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Title</Text>
      <TextInput value={title} onChangeText={setTitle} style={{ borderWidth: 1, marginBottom: 10 }} />

      <Text>Content</Text>
      <TextInput value={content} onChangeText={setContent} style={{ borderWidth: 1, marginBottom: 10 }} multiline />

      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}

      <Button title="Upload Image" onPress={pickImage} />
      <Button title="Create Post" onPress={submitPost} />
    </View>
  );
}
