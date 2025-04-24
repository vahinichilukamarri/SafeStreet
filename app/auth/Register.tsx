import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Worker');

  const handleRegister = async () => {
    if (!name || !phone || !email || !password || !role) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Enter a valid email address.');
      return;
    }

    if (password.length < 8 || !/\d/.test(password)) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 8 characters and contain a number.'
      );
      return;
    }

    try {
      const response = await fetch(
        'https://87c4-183-83-163-184.ngrok-free.app/api/auth/signup', // Replace with your server URL
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, email, password, role }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Registration Failed', data.error || 'Something went wrong.');
        return;
      }

      Alert.alert('Success', 'Account created successfully!');
      router.replace('/auth/Login');
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/potholeclick.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>Register</Text>

            <TextInput
              placeholder="Full Name"
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholderTextColor="#aaa"
            />
            <TextInput
              placeholder="Phone Number"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#aaa"
            />
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#aaa"
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#aaa"
            />
            <TextInput
              placeholder="Role (Worker or Supervisor)"
              style={styles.input}
              value={role}
              onChangeText={setRole}
              placeholderTextColor="#aaa"
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/auth/Login')}>
              <Text style={styles.link}>Already have an account? Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.5)', // optional dark overlay
  },
  card: {
    width: '90%',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // black glassy effect
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  button: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  link: {
    color: 'white',
    marginTop: 15,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
