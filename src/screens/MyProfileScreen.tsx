import { View, Text, Pressable } from "react-native";
import { getUserProfile } from "../utils/getUserProfile";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import ProfileView from "../components/ui/profile/ProfileView";
import { getAvatarUrl } from "../utils/getAvatarUrl";

export function MyProfileScreen() {
  const { accessToken, logout } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getUserProfile(accessToken!),
    enabled: !!accessToken,
  })

  if (isLoading) {
    return <Text>Loading profile...</Text>
  }

  if (error) {
    console.error(error);
    return <Text>Error loading profile...</Text>
  }
  

  const { username, description } = data;
  const avatarUrl = getAvatarUrl(data.userId);
  return (
    <View className="flex-1 items-center justify-center bg-card">
      <ProfileView username={username} description={description} avatarUrl={avatarUrl} isOwnProfile={true} />
      <Pressable
        onPress={logout}
        className="bg-red-500 px-4 py-2 rounded"
      >
        <Text className="text-white font-semibold">Log out</Text>
      </Pressable>
    </View>
  );
}
