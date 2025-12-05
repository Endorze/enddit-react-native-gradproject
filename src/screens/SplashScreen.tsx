import { View, Text, ActivityIndicator } from "react-native";

export default function SplashScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <ActivityIndicator size="large" color="#fff" />
      <Text className="text-white mt-4 text-lg font-semibold">
        Loading...
      </Text>
    </View>
  );
}
