import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  StyleSheet,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';

interface CardData {
  fullName: string;
  company: string;
  title: string;
  phone: string;
  email: string;
  website: string;
}

export default function CardScreen() {
  const navigation = useNavigation();
  const user = auth.currentUser;
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'cards', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCardData(docSnap.data() as CardData);
        }
      } catch (error) {
        console.error('Error fetching card', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!cardData) {
    return (
      <View style={styles.centered}>
        <Text>No business card found.</Text>
        <Button title="Create Card" onPress={() => navigation.navigate('/main/edit')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{cardData.fullName}</Text>
      {cardData.title && cardData.company && (
        <Text style={styles.field}>{cardData.title} at {cardData.company}</Text>
      )}
      {cardData.phone && <Text style={styles.field}>📞 {cardData.phone}</Text>}
      {cardData.email && <Text style={styles.field}>✉️ {cardData.email}</Text>}
      {cardData.website && <Text style={styles.field}>🌐 {cardData.website}</Text>}
      <Button
        title="Edit Card"
        onPress={() => navigation.navigate('/main/edit')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
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
});