import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/HomeScreen";
import { AppTabs } from "./AppTabs";

export type AppStackParamList = {
  Home: undefined,
  Tabs: undefined
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  return (


    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={AppTabs}
        options={{ headerShown: false }}
      />


      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Enddit" }}
      />
    </Stack.Navigator>
  );
}
