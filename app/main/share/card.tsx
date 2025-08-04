import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button, StyleSheet, Share } from 'react-native';
import * as Linking from 'expo-linking';
import CardPreview from '@/components/CardPreview';
import { CardData } from '@/types/card';
import { recordView } from '@/lib/analytics';
import { useNavigation } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';

export default function CardScreen() {
  const navigation = useNavigation();
  const user = auth.currentUser;
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const shareUrl = user ? Linking.createURL(`/share/${user.uid}`) : '';

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'cards', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCardData(docSnap.data() as CardData);
          await recordView(user.uid);
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
      <CardPreview data={cardData} />
      <Button title="Share Card" onPress={() => shareUrl && Share.share({ message: `Check out my digital business card: ${shareUrl}`, url: shareUrl })} />
      <Button
        title="Share via Email"
        onPress={() =>
          shareUrl &&
          Linking.openURL(
            `mailto:?subject=${encodeURIComponent('My Digital Business Card')}&body=${encodeURIComponent(
              `Check out my digital business card: ${shareUrl}`,
            )}`,
          )
        }
      />
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
});