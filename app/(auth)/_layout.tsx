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
          animation: 'slide_from_left',
          
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          animation: 'slide_from_right', 
        }}
      />
    </Stack>
   
  );
}
