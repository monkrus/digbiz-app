import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { auth, db } from '@/firebase';
import { doc, getDoc, collection, getDocs, setDoc } from 'firebase/firestore';
import { CardData } from '@/types/card';

const FILE = FileSystem.documentDirectory + 'backup.json';

export default function BackupScreen() {
  const user = auth.currentUser;

  const handleBackup = async () => {
    if (!user) return;
    const cardSnap = await getDoc(doc(db, 'cards', user.uid));
    const contactsSnap = await getDocs(collection(db, 'contacts', user.uid));
    const contacts: Record<string, any> = {};
    contactsSnap.forEach((d) => (contacts[d.id] = d.data()));
    const data = { card: cardSnap.data(), contacts };
    await FileSystem.writeAsStringAsync(FILE, JSON.stringify(data));
    Alert.alert('Backup saved', `File: ${FILE}`);
  };

  const handleRestore = async () => {
    if (!user) return;
    try {
      const contents = await FileSystem.readAsStringAsync(FILE);
      const data = JSON.parse(contents) as {
        card?: CardData;
        contacts?: Record<string, any>;
      };
      if (data.card) {
        await setDoc(doc(db, 'cards', user.uid), data.card);
      }
      if (data.contacts) {
        for (const [id, value] of Object.entries(data.contacts)) {
          await setDoc(doc(db, 'contacts', user.uid, id), value);
        }
      }
      Alert.alert('Restore complete');
    } catch (err) {
      Alert.alert('Restore failed', String(err));
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Backup" onPress={handleBackup} />
      <Button title="Restore" onPress={handleRestore} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
});
