import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function EnterOTP() {
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const verifyOTP = async () => {
    try {
      const res = await fetch('https://00f5-2409-40f0-125-c676-8857-c408-1556-c6b4.ngrok-free.app/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) return Alert.alert('Error', data.error || 'Invalid OTP');

      Alert.alert('Verified!', 'OTP verified successfully');
      router.push({ pathname: '/auth/resetPassword', params: { email } });
    } catch (err) {
      Alert.alert('Error', 'Server error');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Enter OTP sent to:</Text>
        <Text style={styles.email}>{email}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          keyboardType="numeric"
          onChangeText={setOtp}
        />
        <TouchableOpacity style={styles.button} onPress={verifyOTP}>
          <Text style={styles.buttonText}>Verify OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f3f4f6' },
  card: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 5,
  },
  label: { fontSize: 16, marginBottom: 4 },
  email: { fontSize: 14, marginBottom: 16, color: '#6b7280' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 20 },
  button: { backgroundColor: '#10b981', padding: 16, borderRadius: 8 },
  buttonText: { color: 'white', textAlign: 'center' },
});
