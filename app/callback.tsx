import { useLoader } from '@/components/loader';
import { supabase } from '@/lib/supabase';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';


WebBrowser.maybeCompleteAuthSession(); // Required for Android

export default function Callback() {
  const { showLoader, hideLoader } = useLoader();

  const router = useRouter();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        showLoader();

        const url = await Linking.getInitialURL();
        console.log("===url===",url)
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        console.log("===session==",session)
        
        
        // if (!url) {
        //   Toast.show({ type: 'error', text1: 'Login Failed', text2: 'No redirect URL' });
        //   router.replace('/login');
        //   return;
        // }

        // GitHub returns #code=... → convert hash to query string
        // const parsedUrl = url.replace('#', '?');
        // const parsed = Linking.parse(parsedUrl);
        // const code = parsed.queryParams?.code as string;

        // if (!code) {

        //   Toast.show({ type: 'error', text1: 'Login Failed', text2: 'No authorization code' });
        //   router.replace('/login');
        //   return;
        // }
        // 🔁 Here's where you use it
        // const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        // if (error) {
        //   console.error('❌ exchangeCodeForSession error:', error.message);
        //   Toast.show({ type: 'error', text1: 'Session Error', text2: error.message });
        //   router.replace('/login');
        //   return;
        // }

        // console.log("55555555555")
        Toast.show({ type: 'success', text1: 'Login Successful' });

        router.replace('/(dashboard)');
        hideLoader();


      } catch (err: any) {
        console.error('❌ Unexpected error:', err.message);
        Toast.show({ type: 'error', text1: 'Error', text2: err.message });
        router.replace('/login');
      }
    };

    handleAuthRedirect();
  }, []);

  return (
    null
    // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //   <ActivityIndicator size="large" />
    //   <Text>Authenticating...</Text>
    // </View>
  );
}

