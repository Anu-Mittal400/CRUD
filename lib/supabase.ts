// import { createClient } from '@supabase/supabase-js';
// import { Platform } from 'react-native';
// import 'react-native-url-polyfill/auto';


// const supabaseUrl = 'https://luhuneqtuulusdtojwvd.supabase.co'; // Replace with your Supabase URL
// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1aHVuZXF0dXVsdXNkdG9qd3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5Njk4ODMsImV4cCI6MjA2NzU0NTg4M30.hu7Q_V2DvhfQEF4ADvJ6zXpt6qMSWa0acoTSAa836Fs'; // Replace with your anon key


// let options: any = {
//   auth: {
//     autoRefreshToken: false,
//     persistSession: true,
//     detectSessionInUrl: true,
//   },
// };

// if (Platform.OS !== 'web') {
//   const AsyncStorage = require('@react-native-async-storage/async-storage').default;
//   options.auth.storage = AsyncStorage;
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);


// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://luhuneqtuulusdtojwvd.supabase.co'; // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1aHVuZXF0dXVsdXNkdG9qd3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5Njk4ODMsImV4cCI6MjA2NzU0NTg4M30.hu7Q_V2DvhfQEF4ADvJ6zXpt6qMSWa0acoTSAa836Fs'; // Replace with your anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === 'web' ? undefined : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
