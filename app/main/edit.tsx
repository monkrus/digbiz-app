import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface CardData {
  fullName: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  linkedin: string;
  photoUrl: string;
}

// Simple helpers for validating email and phone numbers
const isValidEmail = (value: string): boolean => /\S+@\S+\.\S+/.test(value);
const isValidPhone = (value: string): boolean => /^\+?[0-9 ()-]{6,}$/i.test(value);

export default function EditCardScreen() {
  const [cardData, setCardData] = useState<CardData>({
    fullName: '',
    title: '',
    company: '',
    phone: '',
    email: '',
    website: '',
    linkedin: '',
    photoUrl: '',
  });
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchCard = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'cards', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Partial<CardData>;
          setCardData({
            fullName: data.fullName ?? '',
            title: data.title ?? '',
            company: data.company ?? '',
            phone: data.phone ?? '',
            email: data.email ?? '',
            website: data.website ?? '',
            linkedin: data.linkedin ?? '',
            photoUrl: data.photoUrl ?? '',
          });
        }
      } catch (err) {
        console.error('Error loading card:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [user]);

  const handleChange = (field: keyof CardData, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Permission to access photos is needed.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      setCardData((prev) => ({ ...prev, photoUrl: result.assets[0].uri }));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    // Trim values to remove leading/trailing whitespace
    const trimmed: CardData = {
      fullName: cardData.fullName.trim(),
      title: cardData.title.trim(),
      company: cardData.company.trim(),
      phone: cardData.phone.trim(),
      email: cardData.email.trim(),
      website: cardData.website.trim(),
      linkedin: cardData.linkedin.trim(),
      photoUrl: cardData.photoUrl.trim(),
    };
    // Validate required fields
    if (!trimmed.fullName) {
      Alert.alert('Validation Error', 'Full Name is required.');
      return;
    }
    if (trimmed.email && !isValidEmail(trimmed.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }
    if (trimmed.phone && !isValidPhone(trimmed.phone)) {
      Alert.alert('Validation Error', 'Please enter a valid phone number.');
      return;
    }

    setLoading(true);
    try {
      await setDoc(doc(db, 'cards', user.uid), trimmed);
      Alert.alert('Success', 'Your card has been updated!');
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('Error', 'Failed to save card.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Your Card</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name*"
        value={cardData.fullName}
        onChangeText={(v) => handleChange('fullName', v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={cardData.title}
        onChangeText={(v) => handleChange('title', v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Company"
        value={cardData.company}
        onChangeText={(v) => handleChange('company', v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={cardData.phone}
        onChangeText={(v) => handleChange('phone', v)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={cardData.email}
        onChangeText={(v) => handleChange('email', v)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Website"
        value={cardData.website}
        onChangeText={(v) => handleChange('website', v)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="LinkedIn"
        value={cardData.linkedin}
        onChangeText={(v) => handleChange('linkedin', v)}
        autoCapitalize="none"
      />
      {cardData.photoUrl ? (
        <Image source={{ uri: cardData.photoUrl }} style={styles.photo} />
      ) : null}
      <Button title="Select Photo" onPress={handleImagePick} />
      <Button
        title={loading ? 'Saving…' : 'Save Card'}
        onPress={handleSave}
        disabled={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 8,
  },
});