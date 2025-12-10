import { View, Text, Pressable, TextInput, Image } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { pickImage } from "../utils/pickImage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useUserProfile } from "../hooks/useUserProfile";
import defaultBanner from "../../assets/default-banner.jpg";
import { getAvatarUrl } from "../utils/profileUtils/getAvatarUrl";
import { API_URL } from "../utils/getUrl";
import { getBannerUrl } from "../utils/profileUtils/getBannerUrl";

export function EditProfileScreen() {
    const { accessToken, user } = useAuth();
    const [description, setDescription] = useState<string>("");
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const { data, isLoading, error } = useUserProfile(accessToken);
    const [initialized, setInitialized] = useState(false);

    const isLocalUri = (uri: string) =>
        uri.startsWith("file://") || uri.startsWith("content://") || uri.startsWith("ph://"); // iOS-varianter

    useEffect(() => {
        if (data) {
            setDescription(data.description ?? "");
            setProfileImage(getAvatarUrl(user.id) ?? null);
            setBannerImage(getBannerUrl(user.id) ?? null);
            setInitialized(true);
        }
    }, [data, user.id, initialized]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Loading profile information...</Text>
            </View>
        );
    }

    if (error || !data) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Failed to load profile information.</Text>
            </View>
        );
    }

    const submitProfileChanges = async () => {
        const form = new FormData();
        form.append("description", description);

        if (profileImage && isLocalUri(profileImage)) {
            const profileFileName = profileImage.split("/").pop() || "avatar.jpg";
            form.append("profileImage", {
                uri: profileImage,
                name: profileFileName,
                type: "image/jpeg",
            } as any);
        }

        if (bannerImage && isLocalUri(bannerImage)) {
            const bannerFileName = bannerImage.split("/").pop() || "banner.jpg";
            form.append("bannerImage", {
                uri: bannerImage,
                name: bannerFileName,
                type: "image/jpeg",
            } as any);
        }

        const res = await fetch(`${API_URL}/api/profile/edit`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: form,
        });
    };


    const bannerSource = bannerImage ?
        { uri: bannerImage } : defaultBanner;



    return (
        <SafeAreaView
            className="flex-1 bg-gray-950"
            edges={["top", "left", "right"]}
        >
            <View className="flex-1">
                <View className="relative">
                    <Pressable
                        onPress={() => pickImage(setBannerImage)}
                        className="h-40 w-full"
                    >
                        {bannerImage ? (
                            <Image
                                source={bannerSource}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="flex-1 items-center justify-center">
                                <Image
                                    source={bannerSource}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            </View>
                        )}
                    </Pressable>

                    <Pressable
                        onPress={() => pickImage(setBannerImage)}
                        className="absolute top-2 right-2 bg-black/60 rounded-full p-2"
                    >
                        <Ionicons name="camera" size={18} color="#fff" />
                    </Pressable>

                    <View className="px-4 -mt-10 flex-row items-end">
                        <View className="w-24 h-24 rounded-full border-4 border-gray-950 bg-gray-700 overflow-hidden">
                            {profileImage ? (
                                <View>
                                    <Image
                                        source={{ uri: profileImage }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                </View>
                            ) : (
                                <View className="flex-1 items-center justify-center">
                                    <Ionicons name="person" size={32} color="#9CA3AF" />
                                </View>
                            )}
                        </View>

                        <Pressable
                            onPress={() => pickImage(setProfileImage)}
                            className="ml-3 px-3 py-1 rounded-full bg-gray-800 flex-row items-center"
                        >
                            <Ionicons name="camera" size={16} color="#e5e7eb" />
                            <Text className="text-gray-200 text-sm ml-1">
                                Change photo
                            </Text>
                        </Pressable>
                    </View>

                    <View className="px-4 mt-3">
                        <Text className="text-xl font-semibold text-white">
                            {data.username}
                        </Text>
                        <Text className="text-xs text-gray-400 mt-0.5">
                            Profile settings
                        </Text>
                    </View>
                </View>

                <View className="px-4 mt-6 flex-1">
                    <Text className="text-sm font-medium text-gray-200 mb-2">
                        Bio
                    </Text>
                    <TextInput
                        placeholder="Write a short bio about yourself..."
                        placeholderTextColor="#6B7280"
                        value={description}
                        onChangeText={setDescription}
                        className="bg-gray-900 border border-gray-700 rounded-xl text-white px-4 py-3"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

                <Pressable
                    onPress={submitProfileChanges}
                    className="bg-blue-600 py-4 w-full items-center"
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                    <Text className="text-white font-bold text-lg">
                        Save changes
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
