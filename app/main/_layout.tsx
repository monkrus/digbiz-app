import { Stack, router } from 'expo-router';
import { auth } from '@/firebase';
import { useEffect } from 'react';

export default function MainLayout() {
  useEffect(() => {
    if (!auth.currentUser) {
      router.replace('/auth/login');
    }
  }, []);

  if (!auth.currentUser) {
    return null;
  }

  return <Stack />;
}
