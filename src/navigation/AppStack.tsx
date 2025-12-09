import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/HomeScreen";
import { AppTabs } from "./AppTabs";
import { PublicProfileScreen } from "../screens/PublicProfileScreen";
import { FriendScreen } from "../screens/FriendScreen";
import { ChatScreen } from "../screens/ChatScreen";
import { EditProfileScreen } from "../screens/EditProfileScreen";

export type AppStackParamList = {
  Home: undefined,
  Tabs: undefined,
  PublicProfile: undefined,
  Friends: undefined,
  Chat: undefined,
  EditProfile: undefined,
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

      <Stack.Screen name="PublicProfile" component={PublicProfileScreen} />
      <Stack.Screen name="Friends" component={FriendScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />



    </Stack.Navigator>


  );
}
