import { AuthProvider } from '@/authcontext';
import { LoaderProvider } from '@/components/loader';
import { ToastProvider } from '@/components/Toast';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [queryClient] = useState(() => new QueryClient());

  if (!loaded) return null;

  return (
    <QueryClientProvider client={queryClient}>

    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <LoaderProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(dashboard)" />
          <Stack.Screen name="callback"/>
        </Stack>
        <StatusBar style="auto" />
        </LoaderProvider>
      </AuthProvider>
      <ToastProvider />

    </ThemeProvider>
    </QueryClientProvider>

  );
}

