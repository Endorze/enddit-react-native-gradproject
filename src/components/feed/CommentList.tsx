import { FlatList, View, Text } from "react-native";
import { CommentForPost } from "../../types/commentlist";

export default function CommentsList({ comments }: { comments: CommentForPost[] }) {
  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ marginTop: 4 }}>
          <Text style={{ fontWeight: "600" }}>{item.user.username}</Text>
          <Text>{item.content}</Text>
        </View>
      )}
    />
  );
}
