// Upload.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, TextInput, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Linking } from 'react-native';

const Upload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { location: locationParam } = useLocalSearchParams(); // Retrieve location from the query params

  useEffect(() => {
    if (locationParam) {
      const loc = JSON.parse(locationParam);
      const address = `Lat: ${loc.latitude}, Lng: ${loc.longitude}`;
      setLocation(address); // Set the location passed from the map
      setManualAddress(address); // Pre-fill the address input
    }
  }, [locationParam]);

  const pickImageFromDevice = async () => {
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        const loc = await Location.getCurrentPositionAsync({});
        const geoCode = await Location.reverseGeocodeAsync(loc.coords);

        if (geoCode.length > 0) {
          const { city, region, country, street } = geoCode[0];
          const fullAddress = `${street ?? ''}, ${city ?? ''}, ${region ?? ''}, ${country ?? ''}`;
          setLocation(fullAddress);
          setManualAddress(fullAddress); // Pre-fill the address
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Could not load image or location.');
    } finally {
      setLoading(false);
    }
  };

  const takeImageWithCamera = async () => {
    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        const loc = await Location.getCurrentPositionAsync({});
        const geoCode = await Location.reverseGeocodeAsync(loc.coords);

        if (geoCode.length > 0) {
          const { city, region, country, street } = geoCode[0];
          const fullAddress = `${street ?? ''}, ${city ?? ''}, ${region ?? ''}, ${country ?? ''}`;
          setLocation(fullAddress);
          setManualAddress(fullAddress); // Pre-fill the address
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Could not get image or location.');
    } finally {
      setLoading(false);
    }
  };

  const openMap = () => {
    const encodedLocation = encodeURIComponent(manualAddress);
    Linking.openURL(`https://maps.google.com?q=${encodedLocation}`);
  };

  const openMapScreen = () => {
    // Navigate to MapScreen correctly
    router.push('/dashboard/MapScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Road Damage</Text>

      <View style={styles.buttonsContainer}>
        <Button title="Click Image" onPress={takeImageWithCamera} />
        <Button title="Upload from Device" onPress={pickImageFromDevice} />
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />}

      {image && <Image source={{ uri: image }} style={styles.image} />}

      {image && (
        <>
          <Text style={styles.label}>📍 Address:</Text>
          <TextInput
            style={styles.input}
            placeholder="Edit location"
            value={manualAddress}
            onChangeText={setManualAddress}
          />
          <Button title="Open Map" onPress={openMap} />
          <Button title="Edit Location on Map" onPress={openMapScreen} />
        </>
      )}

      <Button title="Go Back" onPress={() => router.push('/dashboard/worker')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'Grey',  // Set background color to black
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',  // Adjust title color to make it visible on a black background
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 20,
  },
  loading: {
    marginTop: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 10,
  },
  label: {
    marginTop: 20,
    fontSize: 16,
    color: '#fff',  // Change text color to white for visibility
  },
  input: {
    width: '100%',
    padding: 10,
    marginTop: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});

export default Upload;
