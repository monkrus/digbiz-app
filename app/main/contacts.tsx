import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';
import { auth, db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import CardPreview from '@/components/CardPreview';
import { CardData } from '@/types/card';

interface Contact extends CardData {
  note?: string;
  tags?: string[];
}

export default function ContactsScreen() {
  const user = auth.currentUser;
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const snap = await getDocs(collection(db, 'contacts', user.uid));
      const list: Contact[] = [];
      snap.forEach((d) => list.push(d.data() as Contact));
      setContacts(list);
    };
    load();
  }, [user]);

  const filtered = filter
    ? contacts.filter((c) => c.tags?.some((t) => t.toLowerCase().includes(filter.toLowerCase())))
    : contacts;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Filter by tag"
        value={filter}
        onChangeText={setFilter}
      />
      <FlatList
        data={filtered}
        keyExtractor={(_, idx) => String(idx)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <CardPreview data={item} />
            {item.tags && item.tags.length > 0 && (
              <Text style={styles.tags}>Tags: {item.tags.join(', ')}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={<Text>No contacts</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  item: {
    marginBottom: 16,
  },
  tags: {
    marginTop: 4,
  },
});
