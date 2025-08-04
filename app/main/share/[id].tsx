import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

interface CardData {
  fullName: string;
  company: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  linkedin: string;
  photoUrl: string;
}

export default function SharedCardScreen() {
  const { id } = useLocalSearchParams();
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchCard = async () => {
      try {
        const docRef = doc(db, 'cards', String(id));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCardData(docSnap.data() as CardData);
        }
      } catch (error) {
        console.error('Error fetching card:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, [id]);

  const screenTitle = cardData?.fullName
    ? `${cardData.fullName}'s Card`
    : 'Contact Details';

  return (
    <>
      {/* Configure the stack title dynamically */}
      <Stack.Screen options={{ title: screenTitle }} />
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      ) : !cardData ? (
        <View style={styles.centered}>
          <Text>No card data to show.</Text>
        </View>
      ) : (
        <View style={styles.container}>
          {cardData.photoUrl && (
            <Image source={{ uri: cardData.photoUrl }} style={styles.photo} />
          )}
          <Text style={styles.name}>{cardData.fullName}</Text>
          {cardData.title && cardData.company && (
            <Text style={styles.field}>{cardData.title} at {cardData.company}</Text>
          )}
          {cardData.phone && <Text style={styles.field}>📞 {cardData.phone}</Text>}
          {cardData.email && <Text style={styles.field}>✉️ {cardData.email}</Text>}
          {cardData.website && <Text style={styles.field}>🌐 {cardData.website}</Text>}
          {cardData.linkedin && <Text style={styles.field}>🔗 {cardData.linkedin}</Text>}
        </View>
      )}
    </>
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
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 12,
  },
});