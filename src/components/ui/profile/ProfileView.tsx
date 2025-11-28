import { View, Text, Pressable, Image } from "react-native";

type ProfileViewProps = {
  username: string;
  description?: string;
  avatarUrl?: string | null;
  isOwnProfile?: boolean;
  onEditProfilePress?: () => void;
  onAddFriendPress?: () => void;
  addFriendDisabled?: boolean;
};

export default function ProfileView({
  username,
  description,
  avatarUrl,
  isOwnProfile = false,
  onAddFriendPress,
}: ProfileViewProps) {
  return (
    <View className="flex-1 items-center justify-center bg-card px-6">
      <Text className="text-2xl text-white mb-4">
        {isOwnProfile ? "My Profile 👋" : `${username}'s Profile`}
      </Text>

      <View className="w-24 h-24 rounded-full bg-gray-700 mb-4 overflow-hidden items-center justify-center">
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            className="w-24 h-24"
            resizeMode="cover"
          />
        ) : (
          <Text className="text-white text-xs">No avatar</Text>
        )}
      </View>


      <Text className="text-white text-xl font-semibold mb-2">
        {username}
      </Text>

      <Text className="text-gray-300 mb-6 text-center">
        {description || "No bio yet"}
      </Text>

      {isOwnProfile ? (
        <Pressable className="p-3 bg-green-600 rounded-lg">
          <Text className="text-white font-semibold">Edit Profile</Text>
        </Pressable>
      ) : (
        <Pressable onPress={onAddFriendPress} className="p-3 bg-blue-600 rounded-lg">
          <Text className="text-white font-semibold">Add Friend</Text>
        </Pressable>
      )}
    </View>
  );
}
