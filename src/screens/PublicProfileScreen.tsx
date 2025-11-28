import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getPublicProfile } from "../utils/getPublicProfile";
import ProfileView from "../components/ui/profile/ProfileView";
import { getAvatarUrl } from "../utils/getAvatarUrl";
import { sendFriendRequest } from "../utils/sendFriendRequest";

type RouteParams = {
  username: string;
};

export function PublicProfileScreen() {
  const { accessToken, user } = useAuth();
  const route = useRoute();
  const { username } = route.params as RouteParams;

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => getPublicProfile(username, accessToken!),
    enabled: !!accessToken && !!username,
  });

  const friendRequestMutation = useMutation({
    mutationFn: () =>
      sendFriendRequest({ to_user_id: data?.userId, accessToken: accessToken! }),
  });

  if (isLoading) return <Text>Loading profile...</Text>;
  if (error || !data) return <Text>Error loading profile...</Text>;

  const { description, userId } = data;
  const ownProfile = user?.id === data.userId;
  const avatarUrl = getAvatarUrl(userId);

  const handleAddFriend = () => {
    if (ownProfile) return;
    friendRequestMutation.mutate();
  };

  return (
    <View className="flex-1 items-center justify-center bg-card">
      <ProfileView
        username={username}
        description={description}
        avatarUrl={avatarUrl}
        isOwnProfile={ownProfile}
        onAddFriendPress={handleAddFriend}
        addFriendDisabled={friendRequestMutation.isPending}
      />
    </View>
  );
}
