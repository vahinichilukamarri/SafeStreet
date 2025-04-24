import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ImageBackground,
  Animated,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const router = useRouter();
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(logoOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }).start(() => {
      Animated.timing(contentOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
    });
  }, []);

  const handleStart = () => {
    setShowRoleSelect(true);
  };

  const handleRoleSelect = async (role: string) => {
    await AsyncStorage.setItem('selectedRole', role);
    setSelectedRole(role);
  };

  const navigateTo = (type: 'Login' | 'Register') => {
    router.push({ pathname: `/auth/${type}`, params: { role: selectedRole } });
  };

  return (
    <ImageBackground
      source={require('@/assets/images/potholeclick.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { opacity: contentOpacity }]}>
          <Animated.Image
            source={require('@/assets/images/logo.png')}
            style={[styles.logo, { opacity: logoOpacity }]}
          />
          <Animated.View style={{ opacity: contentOpacity, alignItems: 'center' }}>
            <Text style={styles.title}>Safe Street</Text>
            <Text style={styles.tagline}>Making roads safer, one step at a time</Text>
          </Animated.View>

          {!showRoleSelect && (
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          )}

          {showRoleSelect && !selectedRole && (
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.roleButton} onPress={() => handleRoleSelect('Worker')}>
                <Text style={styles.buttonText}>Worker</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.roleButton} onPress={() => handleRoleSelect('Supervisor')}>
                <Text style={styles.buttonText}>Supervisor</Text>
              </TouchableOpacity>
            </View>
          )}

          {selectedRole && (
            <>
              <Text style={styles.selectedRole}>Selected Role: {selectedRole}</Text>
              <View style={styles.authButtons}>
                <TouchableOpacity style={styles.authButton} onPress={() => navigateTo('Login')}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.authButton} onPress={() => navigateTo('Register')}>
                  <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animated.View>
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
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  tagline: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 5,
    marginBottom: 20,
    textAlign: 'center',
  },
  startButton: {
    marginTop: 20,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonGroup: {
    marginTop: 20,
    gap: 10,
  },
  roleButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 6,
  },
  selectedRole: {
    color: 'white',
    fontSize: 16,
    marginVertical: 10,
  },
  authButtons: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
  authButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
