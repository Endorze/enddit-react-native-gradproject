import { useState } from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
        setLoading(true); 
        await login(email, password);
    } catch (err: any) {
        console.log("error: ", err);
    } finally {
        setLoading(false);
    }
  };

 return (
    <View className="flex-1 items-center pt-24 px-4 bg-background">
      <Text className="text-2xl text-white mb-4">Login</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        className="w-full max-w-md bg-white rounded px-3 py-2 mb-2"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        className="w-full max-w-md bg-white rounded px-3 py-2 mb-4"
      />
      <Pressable
        onPress={onSubmit}
        disabled={loading}
        className="w-full max-w-md bg-blue-600 rounded py-3 opacity-100 disabled:opacity-50"
      >
        <Text className="text-center text-white font-semibold">
          {loading ? "Signing in..." : "Sign in"}
        </Text>
      </Pressable>
    </View>
  );
}
