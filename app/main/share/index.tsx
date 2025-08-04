import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';

// Landing page for the share section.  Offers quick actions to view,
// edit or preview a card.
export default function ShareIndexScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Business Card</Text>
      <Button
        title="View My Card"
        onPress={() => router.push('/main/share/card')}
      />
      <Button
        title="Edit My Card"
        onPress={() => router.push('/main/edit')}
      />
      <Button
        title="View Shared Card (Demo)"
        onPress={() => router.push('/main/share/123')}
      />
      <Button
        title="Sign Out"
        onPress={() =>
          signOut(auth).then(() => router.replace('/auth/login'))
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
});
