import { Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAvatarUrl } from "../../utils/getAvatarUrl";

type AuthorAvatarProps = {
  userId: string;
  username: string;
};

export function AuthorAvatar({ userId, username }: AuthorAvatarProps) {
  const uri = getAvatarUrl(userId);
  const navigation = useNavigation<any>();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate("PublicProfile" as never, { username } as never);
      }}
      className="w-10 h-10"
    >
      <Image
        source={{ uri }}
        className="w-10 h-10 rounded-full"
        resizeMode="cover"
      />
    </Pressable>
  );
}
