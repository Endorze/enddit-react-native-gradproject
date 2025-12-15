import { useRef, useState, ReactNode } from "react";
import {
  View,
  Pressable,
  Animated,
  StyleSheet,
  Modal,
} from "react-native";

type MobileMenuProps = {
  children: ReactNode;
};

export function MobileMenu({ children }: MobileMenuProps) {
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(1)).current;

  const openMenu = () => {
    setVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setVisible(false);
      }
    });
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  return (
    <>
      <Pressable
        onPress={openMenu}
        className="p-3"
        android_ripple={{ color: "#e5e7eb", borderless: true, foreground: true }}
      >
        <View className="w-6 h-0.5 bg-black mb-1.5" />
        <View className="w-6 h-0.5 bg-black mb-1.5" />
        <View className="w-6 h-0.5 bg-black" />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <View style={StyleSheet.absoluteFill}>
          <Pressable
            style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.4)" }]}
            onPress={closeMenu}
          />

          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              width: "70%",
              transform: [{ translateX }],
              zIndex: 10,
              elevation: 10, 
            }}
            className="bg-gray-900 border-l border-gray-800 px-5 pt-12 pb-8"
          >
            {children}
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}
