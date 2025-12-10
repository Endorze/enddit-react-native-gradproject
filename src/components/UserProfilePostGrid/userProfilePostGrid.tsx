import { View, ActivityIndicator, Image, Pressable, Text } from "react-native";
import { FlatGrid } from "react-native-super-grid";
import Constants from "expo-constants";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { Post } from "../../types/post";
import { useAuth } from "../../context/AuthContext";

const API_URL = Constants.expoConfig?.extra?.API_URL;

type UserProfilePostGridProps = {
    userId: string;
};

export function UserProfilePostGrid({ userId }: UserProfilePostGridProps) {
    const { accessToken } = useAuth();
    const navigation = useNavigation<any>();

    const {
        data: posts,
        isLoading,
        error,
    } = useQuery<Post[]>({
        queryKey: ["userPosts", userId],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/api/posts/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!res.ok) throw new Error("Failed to load user posts");
            return res.json();
        },
    });

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center mt-4">
                <ActivityIndicator />
            </View>
        );
    }



    if (!posts || posts.length === 0) {
        return (
            <View className="mt-4 items-center justify-center h-full">
                <Text className="text-gray-400">No posts yet</Text>
            </View>
        );
    }

    return (
        <FlatGrid
            data={posts}
            itemDimension={110}
            spacing={2}
            staticDimension={undefined}
            style={{ marginTop: 16 }}
            renderItem={({ item }) => (
                <Pressable
                    onPress={() =>
                        navigation.navigate("PostDetails", {
                            post: item,
                        })
                    }
                    style={{
                        aspectRatio: 1,
                        backgroundColor: "#d1d5db",
                        overflow: "hidden",
                    }}
                >
                    {item.image ? (
                        <Image
                            source={{ uri: item.image }}
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                            resizeMode="cover"
                        />
                    ) : (
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "#e5e7eb",
                                alignItems: "center",
                                justifyContent: "center",
                                paddingHorizontal: 4,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 10,
                                    color: "#6b7280",
                                    textAlign: "center",
                                }}
                                numberOfLines={3}
                            >
                                {item.content}
                            </Text>
                        </View>
                    )}
                </Pressable>
            )}
        />
    );
}
