import { View, Text, Pressable } from "react-native";
import MainFeed from "../components/feed/MainFeed";

export function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <MainFeed />
    </View>
  );
}
