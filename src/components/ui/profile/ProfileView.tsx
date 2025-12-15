import { useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { useNavigateTo } from "../../../hooks/useNavigateTo";
import { ProfileViewProps } from "../../../types/user";
import { UserProfilePostGrid } from "../../UserProfilePostGrid/userProfilePostGrid";

export default function ProfileView({
  id,
  username,
  description,
  bannerUrl,
  avatarUrl,
  isOwnProfile = false,
  onAddFriendPress,
}: ProfileViewProps) {

  const [avatarError, setAvatarError] = useState(false);
  const [bannerError, setBannerError] = useState(false);
  const navigateTo = useNavigateTo();

  const source =
    !avatarUrl || avatarError
      ? require("../../../../assets/default-avatar.png")
      : { uri: avatarUrl };

  const bannerSource =
    !bannerUrl || bannerError
      ? require("../../../../assets/default-banner.jpg")
      : { uri: bannerUrl };

  const cleanBio =
    (description ?? "")
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

  return (
    <View className="w-full flex-1">

      <View className="w-full h-32">
        <Image
          source={bannerSource}
          className="w-full h-full"
          resizeMode="cover"
          onError={() => setBannerError(true)}
        />
      </View>

      <View className="px-6 -mt-12  ">
        <View className="flex-row items-center gap-2">
          <View className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden border-4 border-gray-950">
            <Image
              source={source}
              className="w-full h-full"
              resizeMode="cover"
              onError={() => setAvatarError(true)}
            />
          </View>
          <Text className="mt-8 text-xl font-semibold">
            {username}
          </Text>
        </View>


        <View className="flex flex-col">
          <Text className="text-gray-600">
            {cleanBio.length > 0 ? cleanBio : "No bio yet"}
          </Text>
          <Text className="font-semibold mt-4 mb-4">
            @{username}
          </Text>
        </View>

        {isOwnProfile ? (
          <View className="flex flex-row gap-2">
            <Pressable
              android_ripple={{
                color: "#e0e0e0",
                borderless: false,
                foreground: true,
              }}
              className="w-full bg-gray-600 rounded-xl flex-1 py-1 items-center"
              onPress={() => navigateTo && navigateTo("EditProfile")}
            >
              <Text className="text-white font-semibold text-base">
                Edit Profile
              </Text>
            </Pressable>
            <Pressable
              android_ripple={{
                color: "#e0e0e0",
                borderless: false,
                foreground: true,
              }}
              className="w-full bg-gray-600 rounded-xl flex-1 py-1 items-center"
              onPress={() => navigateTo && navigateTo("EditProfile")}
            >
              <Text className="text-white font-semibold text-base">
                Share Profile
              </Text>
            </Pressable>
          </View>
        ) : (
          <View className="mt-4">
            <Pressable
              className="w-full bg-blue-600 rounded-full py-3 items-center"
              onPress={onAddFriendPress}
            >
              <Text className="text-white font-semibold text-base">
                Add Friend
              </Text>
            </Pressable>
          </View>
        )}
      </View>
      <View className="flex-1">

        <UserProfilePostGrid userId={id} />
      </View>
    </View>
  );

}
