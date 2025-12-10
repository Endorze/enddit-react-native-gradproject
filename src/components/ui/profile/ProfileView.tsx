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


  return (
    <View className="w-full flex-1 bg-gray-950">

      <View className="w-full h-32 bg-gray-800">
        <Image
          source={bannerSource}
          className="w-full h-full"
          resizeMode="cover"
          onError={() => setBannerError(true)}
        />
        <View className="w-full h-full bg-gray-800" />
      </View>

      <View className="px-6 -mt-12 flex-1">
        <View className="flex-row items-end">
          <View className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden border-4 border-gray-950">
            <Image
              source={source}
              className="w-full h-full"
              resizeMode="cover"
              onError={() => setAvatarError(true)}
            />
          </View>
        </View>

        <Text className="mt-3 text-2xl font-semibold text-white">
          {username}
        </Text>

        <View className="mt-3 bg-gray-900/90 border border-gray-800 rounded-2xl px-4 py-3">
          <Text className="text-gray-200">
            {description && description.trim().length > 0
              ? description
              : "No bio yet"}
          </Text>
        </View>

        {isOwnProfile ? (
          <View className="mt-4">
            <Pressable
              className="w-full bg-blue-600 rounded-full py-3 items-center"
              onPress={() => navigateTo && navigateTo("EditProfile")}
            >
              <Text className="text-white font-semibold text-base">
                Edit Profile
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
        <UserProfilePostGrid userId={id} />
      </View>
    </View>
  );

}
