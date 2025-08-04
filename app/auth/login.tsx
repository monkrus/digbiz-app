import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Simple email validator.  Returns true if the string appears to be a valid
// email address.  This is not exhaustive but catches common mistakes.
const isValidEmail = (value: string): boolean => {
  return /\S+@\S+\.\S+/.test(value);
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Trim whitespace from inputs
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Basic validation before hitting the network
    if (!isValidEmail(trimmedEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (trimmedPassword.length < 6) {
      Alert.alert(
        'Invalid Password',
        'Password must be at least 6 characters long.',
      );
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      Alert.alert('Success', 'You are logged in!');
      // Navigate to the share section after login
      router.replace('/main/share');
    } catch (error: any) {
      // Provide a friendlier error message if possible
      const message =
        (error?.code === 'auth/wrong-password'
          ? 'Incorrect email or password.'
          : error?.message) || 'Unable to log in.';
      Alert.alert('Login Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button
        title={loading ? 'Logging in…' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
});