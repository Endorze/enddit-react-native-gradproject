import { View } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Post } from "../types/post";
import { PostCard } from "../components/feed/PostCard";

type RootStackParamList = {
  PostDetails: { post: Post };
};

type PostDetailsRouteProp = RouteProp<RootStackParamList, "PostDetails">;

export function PostDetailsScreen() {
  const route = useRoute<PostDetailsRouteProp>();
  const { post } = route.params;

  return (
    <View className="flex-1 bg-white">
      <PostCard post={post} />
    </View>
  );
}
