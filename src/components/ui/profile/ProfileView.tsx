import { useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { useNavigateTo } from "../../../hooks/useNavigateTo";
import { ProfileViewProps } from "../../../types/user";

export default function ProfileView({
  username,
  description,
  avatarUrl,
  isOwnProfile = false,
  onAddFriendPress,
}: ProfileViewProps) {

  const [avatarError, setAvatarError] = useState(false);
  const navigateTo = useNavigateTo();

  const source =
    !avatarUrl || avatarError
      ? require("../../../../assets/default-avatar.png")
      : { uri: avatarUrl };

  return (
    <View className="flex-1 items-center justify-center px-6">
      <View className="w-24 h-24 rounded-full bg-gray-700 mb-4 overflow-hidden items-center justify-center">
        {avatarUrl &&
          <Image
            source={source}
            className="w-24 h-24"
            resizeMode="cover"
            onError={() => setAvatarError(true)}
          />
        }

      </View>


      <Text className=" text-xl font-semibold mb-2">
        {username}
      </Text>

      <Text className="text-gray-300 mb-6 text-center">
        {description || "No bio yet"}
      </Text>

      {isOwnProfile ? (
        <Pressable className="p-3 bg-green-600 rounded-lg">
          <Text onPress={() => navigateTo("EditProfile")} className="text-white font-semibold">Edit Profile</Text>
        </Pressable>
      ) : (
        <Pressable onPress={onAddFriendPress} className="p-3 bg-blue-600 rounded-lg">
          <Text className="text-white font-semibold">Add Friend</Text>
        </Pressable>
      )}
    </View>
  );
}
