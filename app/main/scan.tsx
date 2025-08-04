import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert, ActivityIndicator } from 'react-native';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { auth, db } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface CardData {
  fullName: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
}

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [contactUid, setContactUid] = useState<string | null>(null);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [loadingCard, setLoadingCard] = useState(false);
  const [note, setNote] = useState('');
  const [reminder, setReminder] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const extractUid = (data: string): string | null => {
    try {
      const url = new URL(data);
      const segments = url.pathname.split('/').filter(Boolean);
      return segments.pop() || null;
    } catch {
      return data;
    }
  };

  const handleBarCodeScanned = async ({ data }: BarCodeScannerResult) => {
    if (loadingCard) return;
    const uid = extractUid(data);
    if (!uid) {
      Alert.alert('Invalid code');
      return;
    }
    setScanned(true);
    setContactUid(uid);
    setLoadingCard(true);
    try {
      const snap = await getDoc(doc(db, 'cards', uid));
      if (snap.exists()) {
        setCardData(snap.data() as CardData);
      } else {
        Alert.alert('Card not found');
      }
    } catch (err) {
      console.error('Error fetching card:', err);
      Alert.alert('Error', 'Unable to fetch card');
    } finally {
      setLoadingCard(false);
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user || !cardData || !contactUid) return;
    const reminderDate = reminder ? new Date(reminder) : null;
    if (reminder && isNaN(reminderDate!.getTime())) {
      Alert.alert('Invalid reminder date');
      return;
    }
    setSaving(true);
    try {
      await setDoc(
        doc(db, 'contacts', user.uid, contactUid),
        {
          ...cardData,
          note,
          tags: tags
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t),
          ...(reminderDate ? { reminder: reminderDate.toISOString() } : {}),
        },
      );
      Alert.alert('Saved', 'Contact added to your list');
      setCardData(null);
      setContactUid(null);
      setScanned(false);
      setNote('');
      setReminder('');
      setTags('');
    } catch (err) {
      console.error('Error saving contact:', err);
      Alert.alert('Error', 'Failed to save contact');
    } finally {
      setSaving(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  if (!scanned) {
    return (
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    );
  }

  if (loadingCard) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!cardData) {
    return (
      <View style={styles.centered}>
        <Text>Unable to load card.</Text>
        <Button title="Scan Again" onPress={() => setScanned(false)} />
      </View>
    );
  }

  return (
    <View style={styles.form}>
      <Text style={styles.name}>{cardData.fullName}</Text>
      {cardData.title && cardData.company && (
        <Text style={styles.field}>{cardData.title} at {cardData.company}</Text>
      )}
      {cardData.phone && <Text style={styles.field}>📞 {cardData.phone}</Text>}
      {cardData.email && <Text style={styles.field}>✉️ {cardData.email}</Text>}
      {cardData.website && <Text style={styles.field}>🌐 {cardData.website}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Add note"
        value={note}
        onChangeText={setNote}
      />
      <TextInput
        style={styles.input}
        placeholder="Reminder (YYYY-MM-DD)"
        value={reminder}
        onChangeText={setReminder}
      />
      <TextInput
        style={styles.input}
        placeholder="Tags (comma separated)"
        value={tags}
        onChangeText={setTags}
      />
      <Button
        title={saving ? 'Saving…' : 'Save Contact'}
        onPress={handleSave}
        disabled={saving}
      />
      <Button title="Scan Another" onPress={() => {
        setScanned(false);
        setCardData(null);
        setContactUid(null);
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    flex: 1,
    padding: 24,
    gap: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  field: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
});

