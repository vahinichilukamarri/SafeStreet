// MapScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';

const MapScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const router = useRouter();

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleSelectLocation = () => {
    if (selectedLocation) {
      // Go back to the Upload screen with the selected location
      router.push({
        pathname: '/dashboard/upload',
        query: { location: JSON.stringify(selectedLocation) },
      });
    } else {
      alert('Please select a location on the map');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Location on Map</Text>
      <MapView
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} />
        )}
      </MapView>
      <Button title="Select This Location" onPress={handleSelectLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: 400,
  },
});

export default MapScreen;
