import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../screens/LoginScreen";
import { Signup } from "../screens/Signup";
import { PasswordRecoveryScreen } from "../screens/PasswordRecoveryScreen";

export type AuthStackParamList = {
  Login: undefined,
  Signup: undefined,
  Recovery: undefined,
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen name="Signup" component={Signup} options={{ title: "Sign Up" }} />
      <Stack.Screen name="Recovery" component={PasswordRecoveryScreen} options={{ title: "Recover Password" }} />


    </Stack.Navigator>
  );
}
