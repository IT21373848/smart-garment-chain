import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

// Location type
type Location = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

const LocationsScreen = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newLocation, setNewLocation] = useState<Location>({
    id: '',
    name: '',
    lat: 0,
    lng: 0,
  });
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null); // To track which location is being edited

  // Fetch all locations from the API
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.43.89:3000/api/logistics/warehouses/index');
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Failed to fetch locations!',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle DELETE Request
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('http://192.168.43.89:3000/api/logistics/warehouses/index', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }), // sending the id in the body
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error deleting location:', errorData);
        throw new Error('Failed to delete');
      }

      const data = await response.json();

      if (data.error) {
        console.error('Error:', data.error);
        throw new Error(data.error);
      }

      // If successful, remove the location from state
      setLocations(locations.filter(location => location.id !== id));

      // Show success toast
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Success',
        text2: 'Location deleted successfully!',
      });
    } catch (error) {
      console.error('Error deleting location:', error);

      // Show error toast
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Failed to delete location!',
      });
    }
  };

  // Handle PUT Request (Update Location)
  const handleUpdate = async (location: Location) => {
    try {
      const response = await fetch('http://192.168.43.89:3000/api/logistics/warehouses/index', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: location.id,
          name: location.name,
          lat: location.lat,
          lng: location.lng,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error updating location:', errorData);
        throw new Error('Failed to update');
      }

      const data = await response.json();

      if (data.error) {
        console.error('Error:', data.error);
        throw new Error(data.error);
      }

      // If successful, update location in state
      setLocations(locations.map(loc => (loc.id === location.id ? data : loc)));

      // Show success toast
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Success',
        text2: 'Location updated successfully!',
      });

      // Reset the editing state
      setEditingLocationId(null);
    } catch (error) {
      console.error('Error updating location:', error);

      // Show error toast
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Failed to update location!',
      });
    }
  };

  // Handle form input for updating location
  const handleInputChange = (field: keyof Location, value: string) => {
    setNewLocation({
      ...newLocation,
      [field]: field === 'lat' || field === 'lng' ? parseFloat(value) : value,
    });
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchLocations();
  }, []);

  // Function to cancel update
  const handleCancelUpdate = () => {
    setEditingLocationId(null); // Reset editing state
    setNewLocation({ id: '', name: '', lat: 0, lng: 0 }); // Clear form data
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Locations</Text>

      {/* If editing, show the update form */}
      {editingLocationId && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Location ID"
            value={newLocation.id}
            onChangeText={value => handleInputChange('id', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Location Name"
            value={newLocation.name}
            onChangeText={value => handleInputChange('name', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Latitude"
            value={newLocation.lat.toString()}
            keyboardType="numeric"
            onChangeText={value => handleInputChange('lat', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Longitude"
            value={newLocation.lng.toString()}
            keyboardType="numeric"
            onChangeText={value => handleInputChange('lng', value)}
          />

          <TouchableOpacity
            style={styles.addDestinationButton}
            onPress={() => handleUpdate(newLocation)}
          >
            <Text style={styles.addDestinationText}>Update Location</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.addDestinationButton, { backgroundColor: 'gray' }]}
            onPress={handleCancelUpdate}
          >
            <Text style={styles.addDestinationText}>Cancel</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Loading Indicator */}
      {loading && <Text>Loading...</Text>}

      {/* List of Locations */}
      <FlatList
        data={locations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.locationCard}>
            <Text style={styles.locationName}>{item.name}</Text>
            <Text>Lat: {item.lat}</Text>
            <Text>Lng: {item.lng}</Text>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.addDestinationButton}
                onPress={() => {
                  setNewLocation(item); // Prefill the form with existing data
                  setEditingLocationId(item.id); // Set the location being edited
                }}
              >
                <Text style={styles.addDestinationText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addDestinationButton, { backgroundColor: 'red' }]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.addDestinationText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121b2e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#253958',
    borderRadius: 6,
    height: 46,
    paddingHorizontal: 12,
    color: '#ffffff',
    marginBottom: 12,
  },
  addDestinationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  addDestinationText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  locationCard: {
    backgroundColor: '#192841',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  locationName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#ffffff',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default LocationsScreen;
