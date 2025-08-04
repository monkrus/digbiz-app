import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSubscription } from '@/providers/SubscriptionProvider';
import { Button } from 'react-native';
import * as Linking from 'expo-linking';

export default function CRMSyncScreen() {
  const { isPro, purchase } = useSubscription();

  useEffect(() => {
    if (!isPro) {
      Alert.alert(
        'Upgrade Required',
        'CRM sync is available on Pro or Team plans.',
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
      <Text>Connect a CRM</Text>
      <Button
        title="Connect Salesforce"
        onPress={() => Linking.openURL('https://example.com/oauth/salesforce')}
      />
      <Button
        title="Connect HubSpot"
        onPress={() => Linking.openURL('https://example.com/oauth/hubspot')}
      />
    </View>
  );
}
