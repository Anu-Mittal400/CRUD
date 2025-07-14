import { supabase } from '@/lib/supabase';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';

async function createSessionFromUrl(url: string) {
  // Convert hash fragment to query-like format for parsing
  const accessibleUrl = url.replace('#', '?');
  const parsed = Linking.parse(accessibleUrl);
  const params = parsed.queryParams ?? {};

  const access_token = params.access_token as string | undefined;
  const refresh_token = params.refresh_token as string | undefined;
  if (!access_token || !refresh_token) return null;
  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;

  return data.session;
}

export default function Callback() {
  const router = useRouter();
  console.log("===hiiihlooo===")

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const url = await Linking.getInitialURL();
      console.log("hiiiiiii")
      if (!url) {
        Toast.show({ type: 'error', text1: 'Login Failed', text2: 'No URL detected' });
        router.replace('/login');
        return;
      }

      try {
        const session = await createSessionFromUrl(url);
        if (!session) {
          Toast.show({ type: 'error', text1: 'Login Failed', text2: 'Missing tokens' });
          router.replace('/login');
          return;
        }
        router.replace('/(dashboard)');
      } catch (err: any) {
        Toast.show({ type: 'error', text1: 'Session Error', text2: err.message });
        router.replace('/login');
      }
    };

    handleOAuthRedirect();
  }, [router]);

  return null;
}


