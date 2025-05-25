import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  StyleSheet,
  ActivityIndicator,
  Animated,
  ScrollView,
  Dimensions
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

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
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(Dimensions.get('window').height));

  // Fetch all locations from the API
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.43.89:3000/api/logistics/warehouses/index');
      const data = await response.json();
      setLocations(data);
      
      // Animate the content in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Error fetching locations:', error);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Failed to fetch locations!',
        visibilityTime: 3000,
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
        body: JSON.stringify({ id }),
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
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error('Error deleting location:', error);

      // Show error toast
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Failed to delete location!',
        visibilityTime: 3000,
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
        visibilityTime: 2000,
      });

      // Animate the form out then reset editing state
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setEditingLocationId(null);
      });
    } catch (error) {
      console.error('Error updating location:', error);

      // Show error toast
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Failed to update location!',
        visibilityTime: 3000,
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

  // Function to show edit form
  const showEditForm = (item: Location) => {
    setNewLocation(item);
    setEditingLocationId(item.id);
    
    // Animate the form in
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Function to cancel update
  const handleCancelUpdate = () => {
    // Animate the form out
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setEditingLocationId(null);
      setNewLocation({ id: '', name: '', lat: 0, lng: 0 });
    });
  };

  const renderItem = ({ item }: { item: Location }) => (
    <Animated.View 
      style={[
        styles.locationCard,
        { opacity: fadeAnim }
      ]}
    >
      <View style={styles.locationHeader}>
        <Text style={styles.locationName}>{item.name}</Text>
        <View style={styles.locationId}>
          <Text style={styles.idText}>ID: {item.id}</Text>
        </View>
      </View>
      
      <View style={styles.coordinatesContainer}>
        <View style={styles.coordinateBox}>
          <Ionicons name="location" size={18} color="#4da6ff" />
          <Text style={styles.coordinateLabel}>Latitude</Text>
          <Text style={styles.coordinateValue}>{item.lat}</Text>
        </View>
        
        <View style={styles.coordinateBox}>
          <Ionicons name="location" size={18} color="#4da6ff" />
          <Text style={styles.coordinateLabel}>Longitude</Text>
          <Text style={styles.coordinateValue}>{item.lng}</Text>
        </View>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => showEditForm(item)}
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Warehouse Locations</Text>
        <Text style={styles.subtitle}>Manage your logistics network</Text>
      </View>

      {/* Update Form Modal */}
      {editingLocationId && (
        <Animated.View 
          style={[
            styles.editFormContainer,
            {
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.editFormHeader}>
            <Text style={styles.editFormTitle}>Update Location</Text>
            <TouchableOpacity onPress={handleCancelUpdate}>
              <Ionicons name="close-circle-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formScrollView}>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Location ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Location ID"
                placeholderTextColor="#8a9bae"
                value={newLocation.id}
                onChangeText={value => handleInputChange('id', value)}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Location Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Location Name"
                placeholderTextColor="#8a9bae"
                value={newLocation.name}
                onChangeText={value => handleInputChange('name', value)}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Latitude</Text>
              <TextInput
                style={styles.input}
                placeholder="Latitude"
                placeholderTextColor="#8a9bae"
                value={newLocation.lat.toString()}
                keyboardType="numeric"
                onChangeText={value => handleInputChange('lat', value)}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Longitude</Text>
              <TextInput
                style={styles.input}
                placeholder="Longitude"
                placeholderTextColor="#8a9bae"
                value={newLocation.lng.toString()}
                keyboardType="numeric"
                onChangeText={value => handleInputChange('lng', value)}
              />
            </View>

            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => handleUpdate(newLocation)}
            >
              <Ionicons name="save-outline" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      )}

      {/* Loading Indicator */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4da6ff" />
          <Text style={styles.loadingText}>Loading locations...</Text>
        </View>
      ) : (
        <FlatList
          data={locations}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c1220',
  },
  header: {
    backgroundColor: '#192841',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8a9bae',
    textAlign: 'center',
    marginTop: 4
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#8a9bae',
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  locationCard: {
    backgroundColor: '#192841',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationName: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#ffffff',
    flex: 1,
  },
  locationId: {
    backgroundColor: '#253958',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  idText: {
    color: '#8a9bae',
    fontSize: 12,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  coordinateBox: {
    backgroundColor: '#253958',
    borderRadius: 8,
    padding: 12,
    width: '48%',
    alignItems: 'center',
  },
  coordinateLabel: {
    color: '#8a9bae',
    fontSize: 12,
    marginTop: 4,
  },
  coordinateValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '48%',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '48%',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  editFormContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#192841',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    height: '80%',
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  editFormHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  editFormTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  formScrollView: {
    maxHeight: '90%',
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#8a9bae',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#253958',
    borderRadius: 10,
    height: 52,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 16,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 16,
  }
});

export default LocationsScreen;