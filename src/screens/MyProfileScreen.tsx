import { View, Text, Pressable } from "react-native";
import { getUserProfile } from "../utils/getUserProfile";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import ProfileView from "../components/ui/profile/ProfileView";

export function MyProfileScreen() {
  const {accessToken} = useAuth();
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

  const { username, description, avatarUrl } = data;

  return (
    <View className="flex-1 items-center justify-center bg-card">
      <ProfileView username={username} description={description} avatarUrl={avatarUrl} isOwnProfile={true}/>
    </View>
  );
}
