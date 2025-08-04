import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSubscription } from '@/providers/SubscriptionProvider';

export default function AnalyticsScreen() {
  const { isPro, purchase } = useSubscription();

  useEffect(() => {
    if (!isPro) {
      Alert.alert(
        'Upgrade Required',
        'Analytics are available on Pro or Team plans.',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => router.back() },
          { text: 'Upgrade', onPress: () => purchase() },
        ]
      );
    }
  }, [isPro]);

  if (!isPro) {
    return null;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Analytics Feature</Text>
    </View>
  );
}
