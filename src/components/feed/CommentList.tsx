import { FlatList, View, Text } from "react-native";
import { CommentForPost } from "../../types/commentlist";
import { AuthorAvatar } from "../AuthorAvatar/AuthorAvatar";

export default function CommentsList({ comments }: { comments: CommentForPost[] }) {
  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingVertical: 4 }}
      ItemSeparatorComponent={() => (
        <View className="h-px bg-gray-300/60 my-2" />
      )}
      renderItem={({ item }) => (
        <View>
          <View className="flex-row items-center gap-2 mb-1">
            <AuthorAvatar
              userId={item.user.id}
              username={item.user.username}
            />
            <Text className="font-semibold">
              {item.user.username}
            </Text>
          </View>

          <Text className="text-gray-800 leading-5">
            {item.content}
          </Text>
        </View>
      )}
    />
  );
}
