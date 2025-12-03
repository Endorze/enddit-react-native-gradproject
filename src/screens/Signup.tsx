import { useState } from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";
import { Logotype } from "../components/Logotype/logotype";
import { useNavigation } from "@react-navigation/native";
import { SocialBar } from "../components/SocialBar/socialBar";

export function Signup() {
    const { signUp } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<any>();

    const onSubmit = async () => {
        try {
            setLoading(true);
            await signUp(email, password, username);
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <View className="flex-1 items-center pt-24 px-12">
            <Logotype size={"md"} />
            <Text className="text-2xl text-blue-600">Sign up</Text>
            <Text className="text-subtext mb-12">Please sign up to start using our app</Text>

            <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                autoCapitalize="none"
                keyboardType="email-address"
                className="w-full max-w-md bg-white rounded px-3 py-2 mb-4 shadow-sm"
            />
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                className="w-full max-w-md bg-white rounded px-3 py-2 mb-4 shadow-sm"
            />
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                className="w-full max-w-md bg-white rounded px-3 py-2 mb-4 shadow-sm"
            />


            <Pressable
                onPress={onSubmit}
                disabled={loading}
                className="w-full mb-4 max-w-md bg-blue-600 rounded py-3 opacity-100 disabled:opacity-50 mt-4"
            >
                <Text className="text-center text-white font-semibold">
                    {loading ? "Signing in..." : "Create Account"}
                </Text>
            </Pressable>
            <Text>Already have an account?{" "}
                <Text className="text-blue-600" onPress={() => navigation.navigate("Login")}>Log In</Text>
            </Text>
            <SocialBar />
        </View>
    );
}
