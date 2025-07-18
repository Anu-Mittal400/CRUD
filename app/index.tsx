import structuredClone from '@ungap/structured-clone';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = structuredClone;
}

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Delay navigation until after layout mounts
    setTimeout(() => {
      router.replace('/login');
    }, 0);
  }, []);

  return null 
}