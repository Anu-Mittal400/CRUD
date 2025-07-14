import { useAuth } from '@/authcontext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

export default function NotFoundScreen() {
   
  const router = useRouter();
  const { session, sessionLoading } = useAuth();
  
  useEffect(() => {
      if (!sessionLoading)
        if(!session) {
          router.replace('/(auth)/login');
        }
        else {
        router.replace('/(dashboard)'); // or any fallback for valid users
      }
    }, [sessionLoading, session]);
  // router.replace("/(auth)/login")

  return (
    <>
      {/* <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">This screen does not exist.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
