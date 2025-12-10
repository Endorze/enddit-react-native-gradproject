import { View, Text, Pressable } from "react-native";
import { getUserProfile } from "../utils/profileUtils/getUserProfile";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import ProfileView from "../components/ui/profile/ProfileView";
import { useAvatarUrl } from "../utils/profileUtils/getAvatarUrl";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useBannerUrl } from "../utils/profileUtils/getBannerUrl";

export function MyProfileScreen() {
  const { accessToken, logout } = useAuth();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getUserProfile(accessToken!),
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
  });

  const userId = data?.userId ?? null;
  const { url: avatarUrl, refresh: refreshAvatar } = useAvatarUrl(userId);
  const { url: bannerUrl, refresh: refreshBanner } = useBannerUrl(userId);


  useFocusEffect(
    useCallback(() => {
      refetch();
      refreshAvatar();
      refreshBanner();
    }, [refetch, refreshAvatar])
  );

  if (isLoading) {
    return <Text>Loading profile...</Text>;
  }

  if (error || !data) {
    console.error(error);
    return <Text>Error loading profile...</Text>;
  }

  const { username, description } = data;

  return (
    <View className="flex-1">
      <ProfileView
        id={userId}
        username={username}
        description={description}
        avatarUrl={avatarUrl ?? undefined}
        bannerUrl={bannerUrl ?? null} 
        isOwnProfile={true}
        onAddFriendPress={undefined}
      />
      <Pressable
        onPress={logout}
        className="bg-red-500 px-4 py-2 rounded self-center mt-4"
      >
        <Text className="text-white font-semibold">Log out</Text>
      </Pressable>
    </View>
  );
}
