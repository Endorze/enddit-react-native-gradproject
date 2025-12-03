import { View, Text, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";
import MainFeed from "../components/feed/MainFeed";

export function HomeScreen() {
  const { logout } = useAuth();

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl text-white mb-4">Welcome to Enddit 👋</Text>
      <Pressable
        onPress={logout}
        className="bg-red-500 px-4 py-2 rounded"
      >
        <Text className="text-white font-semibold">Log out</Text>
      </Pressable>
      <MainFeed />
    </View>
  );
}
