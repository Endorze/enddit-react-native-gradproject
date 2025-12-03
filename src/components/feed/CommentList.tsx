import { FlatList, View, Text } from "react-native";
import { CommentForPost } from "../../types/commentlist";
import { AuthorAvatar } from "../AuthorAvatar/AuthorAvatar";

export default function CommentsList({ comments }: { comments: CommentForPost[] }) {
  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ marginTop: 4 }}>
          <View className="flex flex-row items-center gap-2">
            <AuthorAvatar userId={item.user.id} username={item.user.username} />
            <Text style={{ fontWeight: "600" }}>{item.user.username}</Text>
          </View>
          <Text>{item.content}</Text>
        </View>
      )}
    />
  );
}
