import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserProfile } from "../utils/profileUtils/getUserProfile";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import ProfileView from "../components/ui/profile/ProfileView";
import { useAvatarUrl } from "../utils/profileUtils/getAvatarUrl";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useBannerUrl } from "../utils/profileUtils/getBannerUrl";
import { MobileMenu } from "../components/MobileMenu/mobileMenu";

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
    }, [refetch, refreshAvatar, refreshBanner])
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
    <SafeAreaView className="flex-1">
      <View className="flex-row items-center justify-between px-4 pt-2 pb-2">
        <Text className="text-xl font-semibold">My Profile</Text>

        <MobileMenu>
          <Text className="text-white text-lg font-semibold mb-4">
            Menu
          </Text>

          <Pressable
            className="w-full py-3 mb-3"
            onPress={logout}
          >
            <Text className="text-white font-semibold text-base">
              Log out
            </Text>
          </Pressable>
        </MobileMenu>
      </View>

      <ProfileView
        id={userId}
        username={username}
        description={description}
        avatarUrl={avatarUrl ?? undefined}
        bannerUrl={bannerUrl ?? null}
        isOwnProfile={true}
        onAddFriendPress={undefined}
      />
    </SafeAreaView>
  );
}
