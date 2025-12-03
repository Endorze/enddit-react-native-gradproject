import { View, Pressable } from "react-native";
import { Linking } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons"; 

export function SocialBar() {
  const open = (url: string) => Linking.openURL(url);

  return (
    <View className="flex-row gap-6 mt-12">

      <Pressable onPress={() => open("https://www.instagram.com/alexander_webdev/")}>
        <AntDesign name="instagram" size={32} color="#E1306C" />
      </Pressable>


      <Pressable onPress={() => open("https://www.linkedin.com/in/alexander-hallgren-5a4a501aa/")}>
        <FontAwesome name="linkedin-square" size={32} color="#0A66C2" />
      </Pressable>

      <Pressable onPress={() => open("https://web.facebook.com/profile.php?id=100008084297525")}>
        <FontAwesome name="facebook-square" size={32} color="#1877F2" />
      </Pressable>
    </View>
  );
}
