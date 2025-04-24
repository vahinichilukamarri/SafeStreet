import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import userIcon from '@/assets/images/user-icon.png'; // Your user icon path

const DashboardScreen = () => {
  const router = useRouter();
  const { name } = useLocalSearchParams(); // Retrieving the name from query params

  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (name) {
      setUserName(name); // Set the userName if available in the query params
    }
  }, [name]);

  const handleNavigation = (screen: string) => {
    router.push(`/dashboard/${screen}`);
  };

  return (
    <View style={styles.container}>
      {/* User Info Section */}
      <View style={styles.userInfo}>
        <Image source={userIcon} style={styles.icon} />
        <Text style={styles.userName}>Welcome, {userName || 'Guest'} 👋</Text>
      </View>

      {/* Dashboard Options */}
      <View style={styles.dashboardOptions}>
        <TouchableOpacity style={styles.optionButton} onPress={() => handleNavigation('home')}>
          <Text style={styles.optionText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => handleNavigation('upload')}>
          <Text style={styles.optionText}>Upload Pics</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => handleNavigation('report')}>
          <Text style={styles.optionText}>Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#909090',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dashboardOptions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#014d4e',
    width: '80%',
    padding: 14,
    marginBottom: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
