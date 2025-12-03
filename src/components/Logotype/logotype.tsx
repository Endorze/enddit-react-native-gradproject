import { Image } from "react-native";

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-20 h-20",
  lg: "w-28 h-28",
  xl: "w-32 h-32",
};

export function Logotype({ size = "md" }: { size?: keyof typeof sizeClasses }) {
  return (
    <Image
      source={require("../../../assets/ei.png")}
      className={`${sizeClasses[size]} mb-8 rounded-md`}
      resizeMode="contain"
    />
  );
}
