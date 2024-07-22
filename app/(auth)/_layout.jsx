import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        {/* Sign In Screen */}
        <Stack.Screen
          name="signin"
          options={{
            headerShown: false,
          }}
        />

        {/* Sign Up Screen */}
        <Stack.Screen
          name="signup"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor={"#161622"} style="light" />
    </>
  );
};

export default AuthLayout;
