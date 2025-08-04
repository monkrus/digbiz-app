import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CardData } from '@/types/card';

interface Props {
  data: Partial<CardData>;
}

export default function CardPreview({ data }: Props) {
  const theme = data.theme || 'light';
  const styles = theme === 'dark' ? darkStyles : lightStyles;

  return (
    <View style={[baseStyles.container, styles.container]}>
      {data.fullName ? <Text style={[baseStyles.name, styles.text]}>{data.fullName}</Text> : null}
      {data.title && data.company ? (
        <Text style={[baseStyles.field, styles.text]}>{data.title} at {data.company}</Text>
      ) : null}
      {data.phone ? <Text style={[baseStyles.field, styles.text]}>📞 {data.phone}</Text> : null}
      {data.email ? <Text style={[baseStyles.field, styles.text]}>✉️ {data.email}</Text> : null}
      {data.website ? <Text style={[baseStyles.field, styles.text]}>🌐 {data.website}</Text> : null}
    </View>
  );
}

const baseStyles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    gap: 6,
    marginTop: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  field: {
    fontSize: 16,
  },
});

const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  text: {
    color: '#000',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    borderColor: '#555',
    borderWidth: 1,
  },
  text: {
    color: '#fff',
  },
});
