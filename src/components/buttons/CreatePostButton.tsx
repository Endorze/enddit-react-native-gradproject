import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export function CreatePostButton({ onPress }: {onPress?: () => void}) {
  return (
    <TouchableOpacity
      style={styles.plusButtonContainer}
      onPress={onPress}
    >
      <View style={styles.plusButton}>
        <Text style={styles.plusSymbol}>＋</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  plusButtonContainer: {
    top: -20,          
    justifyContent: "center",
    alignItems: "center",
  },
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2563eb",
  },
  plusSymbol: {
    color: "#fff",
    fontSize: 32,
  },
});
