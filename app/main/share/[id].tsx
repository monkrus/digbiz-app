import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import CardPreview from '@/components/CardPreview';
import { CardData } from '@/types/card';
import { recordView } from '@/lib/analytics';

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
          const data = docSnap.data() as CardData;
          setCardData(data);
          await recordView(String(id));
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
          <CardPreview data={{ fullName: 'No card data' }} />
        </View>
      ) : (
        <View style={styles.container}>
          <CardPreview data={cardData} />
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
  },
});