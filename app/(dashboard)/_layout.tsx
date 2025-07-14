import { Stack } from "expo-router";

export default function DashboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        navigationBarColor : "#fff",
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
    
   
  );
}
