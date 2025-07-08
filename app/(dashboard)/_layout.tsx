import { Stack } from "expo-router";

export default function DashboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // applies to all
        navigationBarColor : "#fff",
      }}
    >
      <Stack.Screen name="(dashboard)/index" />
    </Stack>
   
  );
}
