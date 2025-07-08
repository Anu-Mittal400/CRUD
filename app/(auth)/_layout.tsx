import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // applies to all
        navigationBarColor : "#fff",
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          animation: 'slide_from_left', // 👈 login slides in from left
          
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          animation: 'slide_from_right', // 👈 signup slides in from right
        }}
      />
    </Stack>
   
  );
}
