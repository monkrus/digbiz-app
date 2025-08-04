import { Stack } from 'expo-router';
import { SubscriptionProvider } from '@/providers/SubscriptionProvider';

export default function RootLayout() {
  return (
    <SubscriptionProvider>
      <Stack />
    </SubscriptionProvider>
  );
}

