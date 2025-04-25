import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const storedRole = await AsyncStorage.getItem('selectedRole');
      setSelectedRole(storedRole || (typeof role === 'string' ? role : null));
    };
    fetchRole();
  }, [role]);

  const validateAndLogin = async () => {
    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email.');
      return;
    }

    if (password.length < 8 || !/\d/.test(password)) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters long and include a number.');
      return;
    }

    try {
      const response = await fetch('https://00f5-2409-40f0-125-c676-8857-c408-1556-c6b4.ngrok-free.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });

      const text = await response.text();
      console.log("Login response:", text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (err) {
        Alert.alert('Login Failed', 'Invalid server response');
        return;
      }

      if (!response.ok) {
        Alert.alert('Login Failed', result.error || 'Login failed');
        return;
      }

      Alert.alert('Success', `Welcome ${result.user?.name || 'User'}`);

      if (selectedRole === 'Worker') {
        router.replace({
          pathname: '/dashboard/worker',
          params: { name: result.user.name },
        });
      } else {
        router.replace({
          pathname: '/dashboard/supervisor',
          params: { name: result.user.name },
        });
      }      
    } catch (err) {
      Alert.alert('Login Failed', err.message);
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/potholeclick.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{selectedRole} Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <View style={{ width: '100%', position: 'relative' }}>
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.toggleTextButton}
            >
              <Text style={{ color: '#1e40af', fontWeight: 'bold' }}>
                {passwordVisible ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={validateAndLogin}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/auth/forgot')}>
            <Text style={styles.link}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/auth/Register')}>
            <Text style={styles.link}>No account? Register</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    padding: 20,
  },
  card: {
    width: '90%',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
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
  },
  link: {
    color: 'white',
    marginTop: 15,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  toggleTextButton: {
    position: 'absolute',
    right: 15,
    top: '35%',
  },
});
