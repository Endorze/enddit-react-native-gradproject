import { Pressable, Text, GestureResponderEvent } from "react-native";

type ButtonProps = {
    title: string;
    onPress?: (event: GestureResponderEvent) => void;
    variant?: ("primary" | "secondary" | "danger");
};

export default function Button({title, onPress, variant = "primary"}: ButtonProps) {
    const variants = {
        primary: "bg-blue-600",
        secondary: "bg-gray-600",
        danger: "bg-red-600",
    };

    return (
        <Pressable onPress={onPress} className={`px-4 py-3 rounded-lg ${variants[variant]}`}>
            <Text className="text-white font-semibold text-center">{title}</Text>
        </Pressable>
    )

}