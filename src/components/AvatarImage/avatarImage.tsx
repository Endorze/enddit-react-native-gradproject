import { Image } from "react-native";
import { getAvatarUrl } from "../../utils/getAvatarUrl";

export function AuthorAvatar({ userId }: { userId: string }) {
  const uri = getAvatarUrl(userId);

  return (
    <Image
      source={{ uri }}
      className="w-10 h-10 rounded-full"
      resizeMode="cover"
    />
  );
}
