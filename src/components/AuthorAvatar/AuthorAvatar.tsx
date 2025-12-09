import { Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { getAvatarUrl } from "../../utils/profileUtils/getAvatarUrl";

type AuthorAvatarProps = {
  userId: string;
  username: string;
};

export function AuthorAvatar({ userId, username }: AuthorAvatarProps) {
  const [hasError, setHasError] = useState(false);
  const navigation = useNavigation<any>();

  const uri = getAvatarUrl(userId);

  const source = !uri || hasError
    ? require("../../../assets/default-avatar.png")
    : { uri };

  return (
    <Pressable
      onPress={() => {
        navigation.navigate("PublicProfile" as never, { username } as never);
      }}
      className="w-10 h-10"
    >
      <Image
        source={source}
        className="w-10 h-10 rounded-full"
        resizeMode="cover"
        onError={() => setHasError(true)}
      />
    </Pressable>
  );
}
