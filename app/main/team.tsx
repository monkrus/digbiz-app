import React, { useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSubscription } from '@/providers/SubscriptionProvider';

export default function TeamScreen() {
  const { isPro, purchase } = useSubscription();

  useEffect(() => {
    if (!isPro) {
      Alert.alert(
        'Upgrade Required',
        'Team management is available on the Team plan.',
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
      <Text style={styles.title}>Team Administration</Text>
      <Text>Manage members and permissions here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
