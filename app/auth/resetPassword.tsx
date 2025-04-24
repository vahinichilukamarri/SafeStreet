import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const resetPassword = async () => {
    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
      return Alert.alert(
        'Invalid Password',
        'Password must be at least 8 characters and contain a number'
      );
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert('Password Mismatch', 'Passwords do not match');
    }

    try {
      const res = await fetch('https://87c4-183-83-163-184.ngrok-free.app/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) return Alert.alert('Error', data.error || 'Failed to reset');

      Alert.alert('Success', 'Password updated successfully');
      router.replace('/auth/Login');
    } catch (err) {
      Alert.alert('Error', 'Server error');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset Password</Text>

        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={!showPassword}
          onChangeText={setNewPassword}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={!showPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.toggle}>
            {showPassword ? 'Hide' : 'Show'} Password
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={resetPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    color: '#ddd',
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  toggle: {
    color: '#38bdf8',
    textAlign: 'right',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
