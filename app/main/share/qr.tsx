import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Linking from 'expo-linking';
import { auth } from '@/firebase';
import { recordShare } from '@/lib/analytics';

export default function QRScreen() {
  const user = auth.currentUser;
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const link = Linking.createURL(`/main/share/${user.uid}`);
    setUrl(link);
    recordShare(user.uid);
  }, [user]);

  if (!url) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.centered}>
      <QRCode value={url} size={220} />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
