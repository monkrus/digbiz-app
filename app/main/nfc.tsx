import React, { useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSubscription } from '@/providers/SubscriptionProvider';

export default function NFCScreen() {
  const { isPro, purchase } = useSubscription();

  useEffect(() => {
    if (!isPro) {
      Alert.alert(
        'Upgrade Required',
        'NFC sharing is available on the Pro+ plan.',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => router.back() },
          { text: 'Upgrade', onPress: () => purchase() },
        ],
      );
    }
  }, [isPro]);

  if (!isPro) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NFC Sharing</Text>
      <Text>This device can share your profile via NFC.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
