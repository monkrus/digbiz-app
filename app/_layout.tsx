import { Stack, useRouter } from 'expo-router';
import { SubscriptionProvider } from '@/providers/SubscriptionProvider';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const sub = Linking.addEventListener('url', ({ url }) => {
      const { path } = Linking.parse(url);
      if (path) {
        router.push('/' + path);
      }
    });
    return () => sub.remove();
  }, [router]);

  return (
    <SubscriptionProvider>
      <Stack />
    </SubscriptionProvider>
  );
}

