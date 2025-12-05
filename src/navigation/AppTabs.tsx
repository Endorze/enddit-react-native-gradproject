import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/HomeScreen";
import { CreatePostScreen } from "../screens/CreatePostScreen";
import { Ionicons } from "@expo/vector-icons";
import { MyProfileScreen } from "../screens/MyProfileScreen";
import { InboxScreen } from "../screens/InboxScreen";
import { FriendScreen } from "../screens/FriendScreen";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests, FriendRequest } from "../utils/getFriendRequests";

export type AppTabParamList = {
  Feed: undefined;
  CreatePost: undefined;
  Profile: undefined;
  Inbox: undefined;
  Friends: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export function AppTabs() {
  const { accessToken } = useAuth();
  const { data: friendRequests = [] } = useQuery<FriendRequest[]>({
    queryKey: ["friendRequests"],
    queryFn: () => getFriendRequests(accessToken!),
    enabled: !!accessToken,
    refetchInterval: 10000, 
  });

  const hasUnreadFriendRequests = friendRequests.length > 0;
  const unreadCount = friendRequests.length;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabelPosition: "below-icon",
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },

        tabBarBadge:
          route.name === "Inbox" && hasUnreadFriendRequests
            ? unreadCount
            : undefined,

        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";
          let iconColor = color;

          if (route.name === "Feed") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "CreatePost") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Inbox") {
            if (hasUnreadFriendRequests) {
              iconName = "mail-unread-outline";
              iconColor = "#f97316"; 
            } else {
              iconName = focused ? "mail" : "mail-outline";
            }
          } else if (route.name === "Friends") {
            iconName = focused ? "people" : "people-outline";
          }

          return <Ionicons name={iconName} size={size} color={iconColor} />;
        },
      })}
    >
      <Tab.Screen
        name="Feed"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen name="Friends" component={FriendScreen} />
      <Tab.Screen
        name="CreatePost"
        options={{ tabBarLabel: () => null }}
        component={CreatePostScreen}
      />
      <Tab.Screen name="Inbox" component={InboxScreen} />
      <Tab.Screen name="Profile" component={MyProfileScreen} />
    </Tab.Navigator>
  );
}
