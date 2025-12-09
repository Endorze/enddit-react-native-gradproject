import { useNavigation } from "@react-navigation/native";

export function useNavigateTo() {
  const navigation = useNavigation<any>();

  return (path: string, params?: any) => {
    navigation.navigate(path, params);
  };
}
