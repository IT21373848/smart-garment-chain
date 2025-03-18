import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from "@react-navigation/native";

// Define the types
interface Delivery {
    volume_cft: string;
    weight_kg: string;
}

interface Destination {
    lat: string;
    lng: string;
    deliveries: Delivery[];
}

interface StartPoint {
    lat: string;
    lng: string;
}

interface Location {
    id: string;
    name: string;
    lat: number;
    lng: number;
}

interface RequestBody {
    start: {
        lat: number;
        lng: number;
    };
    destinations: {
        lat: number;
        lng: number;
        deliveries: {
            volume_cft: number;
            weight_kg: number;
        }[];
    }[];
}

export default function TransportScreen() {
    const router = useRouter();
    const navigation = useNavigation(); // Get navigation instance

    // Sample data to match your request body
    const savedLocations: Location[] = [
        { id: "start", name: "Main Warehouse", lat: 6.745142, lng: 80.129544 },
        { id: "dest1", name: "Colombo City", lat: 6.927079, lng: 79.861244 },
        { id: "dest2", name: "Dehiwala", lat: 6.912257, lng: 79.924209 },
        { id: "dest3", name: "Kandy", lat: 7.290572, lng: 80.633726 },
        { id: "dest4", name: "Badulla", lat: 6.989558, lng: 81.055240 },
        { id: "dest5", name: "Jaffna", lat: 8.927960, lng: 79.952904 },
        { id: "dest6", name: "Matara", lat: 5.968764, lng: 80.565003 },
        { id: "dest7", name: "Monaragala", lat: 6.949227, lng: 81.142373 },
    ];

    // State structure matching your JSON format
    const [startPoint, setStartPoint] = useState<StartPoint>({ lat: '6.745142', lng: '80.129544' });
    const [selectedStartLocation, setSelectedStartLocation] = useState<string>("start");

    const [destinations, setDestinations] = useState<(Destination & { selectedLocationId: string })[]>([
        {
            lat: '6.927079',
            lng: '79.861244',
            selectedLocationId: "dest1",
            deliveries: [{ volume_cft: '246', weight_kg: '3000' }]
        }
    ]);

    // Function to handle start location selection
    const handleStartLocationChange = (locationId: string): void => {
        setSelectedStartLocation(locationId);
        const location = savedLocations.find(loc => loc.id === locationId);
        if (location) {
            setStartPoint({ lat: location.lat.toString(), lng: location.lng.toString() });
        }
    };

    // Function to handle destination location selection
    const handleDestinationLocationChange = (destIndex: number, locationId: string): void => {
        const location = savedLocations.find(loc => loc.id === locationId);
        if (location) {
            const newDestinations = [...destinations];
            newDestinations[destIndex] = {
                ...newDestinations[destIndex],
                lat: location.lat.toString(),
                lng: location.lng.toString(),
                selectedLocationId: locationId
            };
            setDestinations(newDestinations);
        }
    };

    // Function to add a new destination
    const addDestination = (): void => {
        const defaultLocationId = savedLocations[1]?.id || "";
        const defaultLocation = savedLocations.find(loc => loc.id === defaultLocationId);

        setDestinations([
            ...destinations,
            {
                lat: defaultLocation?.lat.toString() || '',
                lng: defaultLocation?.lng.toString() || '',
                selectedLocationId: defaultLocationId,
                deliveries: [{ volume_cft: '', weight_kg: '' }]
            }
        ]);
    };

    // Function to remove a destination
    const removeDestination = (destIndex: number): void => {
        if (destinations.length > 1) {
            setDestinations(destinations.filter((_, index) => index !== destIndex));
        }
    };

    // Function to add a delivery to a destination
    const addDelivery = (destIndex: number): void => {
        const newDestinations = [...destinations];
        newDestinations[destIndex].deliveries.push({ volume_cft: '', weight_kg: '' });
        setDestinations(newDestinations);
    };

    // Function to remove a delivery from a destination
    const removeDelivery = (destIndex: number, deliveryIndex: number): void => {
        if (destinations[destIndex].deliveries.length > 1) {
            const newDestinations = [...destinations];
            newDestinations[destIndex].deliveries = newDestinations[destIndex].deliveries.filter(
                (_, index) => index !== deliveryIndex
            );
            setDestinations(newDestinations);
        }
    };

    // Function to update start point
    const updateStartPoint = (field: keyof StartPoint, value: string): void => {
        setStartPoint({ ...startPoint, [field]: value });
        setSelectedStartLocation("custom");
    };

    // Function to update destination
    const updateDestination = (destIndex: number, field: keyof Omit<Destination, 'deliveries'>, value: string): void => {
        const newDestinations = [...destinations];
        newDestinations[destIndex] = {
            ...newDestinations[destIndex],
            [field]: value,
            selectedLocationId: "custom"
        };
        setDestinations(newDestinations);
    };

    // Function to update delivery
    const updateDelivery = (destIndex: number, deliveryIndex: number, field: keyof Delivery, value: string): void => {
        const newDestinations = [...destinations];
        newDestinations[destIndex].deliveries[deliveryIndex] = {
            ...newDestinations[destIndex].deliveries[deliveryIndex],
            [field]: value
        };
        setDestinations(newDestinations);
    };

    // Function to handle form submission
    const handleOptimize = async (): Promise<void> => {
        // Create the request body
        const requestBody: RequestBody = {
            start: {
                lat: parseFloat(startPoint.lat),
                lng: parseFloat(startPoint.lng)
            },
            destinations: destinations.map(dest => ({
                lat: parseFloat(dest.lat),
                lng: parseFloat(dest.lng),
                deliveries: dest.deliveries.map(delivery => ({
                    volume_cft: parseFloat(delivery.volume_cft) || 0,
                    weight_kg: parseFloat(delivery.weight_kg) || 0
                }))
            }))
        };

        // Log the request body (for debugging)
        console.log("Request body:", JSON.stringify(requestBody, null, 2));

        try {
            // Send the API request
            const response = await fetch("http://192.168.43.89:3000/api/logistics/calculate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            // Parse the response
            const data = await response.json();
            console.log("API Response:", data);

            // Show success alert
            Alert.alert("Success", "Optimization request processed successfully!");

            // Choose the right navigation method based on your setup
            if (router && router.push) {
                // Using Expo Router
                router.push({
                    pathname: '/OptimizedTransport', // Ensure this matches your actual route file
                    params: { transportData: JSON.stringify(data) }
                });
            
            } else {
                console.error("Navigation object not available");
            }
        } catch (error) {
            console.error("Error sending request:", error);
            Alert.alert("Error", "Failed to optimize transport.");
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Transport Management</Text>
                <Text style={styles.headerSubtitle}>Plan and optimize your deliveries</Text>
            </View>

            {/* Main Content */}
            <ScrollView style={styles.content}>
                {/* Add Warehouse Button */}
                <TouchableOpacity
                    style={styles.addWarehouseButton}
                    onPress={() => router.push('/add-warehouse')}
                >
                    <Ionicons name="add-circle" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Add New Warehouse</Text>
                </TouchableOpacity>

                {/* Transport Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Create Transport Plan</Text>

                    {/* Starting Point */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Starting Point</Text>

                        {/* Warehouse selection dropdown */}
                        <Text style={styles.inputLabel}>Select Location</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                style={styles.picker}
                                selectedValue={selectedStartLocation}
                                onValueChange={handleStartLocationChange}
                                dropdownIconColor="#fff"
                            >
                                {savedLocations.map(location => (
                                    <Picker.Item key={location.id} label={location.name} value={location.id} color="#000" />
                                ))}
                                <Picker.Item label="Custom Location" value="custom" color="#000" />
                            </Picker>
                        </View>
                    </View>

                    {/* Destinations */}
                    {destinations.map((destination, destIndex) => (
                        <View key={destIndex} style={styles.destinationContainer}>
                            <View style={styles.destinationHeader}>
                                <Text style={styles.destinationTitle}>Destination {destIndex + 1}</Text>
                                {destinations.length > 1 && (
                                    <TouchableOpacity onPress={() => removeDestination(destIndex)}>
                                        <Ionicons name="close-circle" size={24} color="#e74c3c" />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Warehouse selection dropdown */}
                            <Text style={styles.inputLabel}>Select Location</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    style={styles.picker}
                                    selectedValue={destination.selectedLocationId}
                                    onValueChange={(value) => handleDestinationLocationChange(destIndex, value)}
                                    dropdownIconColor="#fff"
                                >
                                    {savedLocations.filter(l => l.id !== "start").map(location => (
                                        <Picker.Item key={location.id} label={location.name} value={location.id} color="#000" />
                                    ))}
                                    <Picker.Item label="Custom Location" value="custom" color="#000" />
                                </Picker>
                            </View>

                            {/* Destination Coordinates */}

                            {/* Deliveries */}
                            <Text style={styles.subSectionTitle}>Deliveries</Text>
                            {destination.deliveries.map((delivery, deliveryIndex) => (
                                <View key={deliveryIndex} style={styles.deliveryContainer}>
                                    <View style={styles.deliveryHeader}>
                                        <Text style={styles.deliveryTitle}>Delivery {deliveryIndex + 1}</Text>
                                        {destination.deliveries.length > 1 && (
                                            <TouchableOpacity onPress={() => removeDelivery(destIndex, deliveryIndex)}>
                                                <Ionicons name="remove-circle" size={22} color="#e74c3c" />
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    <View style={styles.rowInputs}>
                                        <View style={styles.halfInput}>
                                            <Text style={styles.inputLabel}>Volume (CFT)</Text>
                                            <TextInput
                                                style={styles.input}
                                                value={delivery.volume_cft}
                                                onChangeText={(value) => updateDelivery(destIndex, deliveryIndex, 'volume_cft', value)}
                                                placeholder="Enter volume"
                                                placeholderTextColor="#8a9bae"
                                                keyboardType="numeric"
                                            />
                                        </View>

                                        <View style={styles.halfInput}>
                                            <Text style={styles.inputLabel}>Weight (KG)</Text>
                                            <TextInput
                                                style={styles.input}
                                                value={delivery.weight_kg}
                                                onChangeText={(value) => updateDelivery(destIndex, deliveryIndex, 'weight_kg', value)}
                                                placeholder="Enter weight"
                                                placeholderTextColor="#8a9bae"
                                                keyboardType="numeric"
                                            />
                                        </View>
                                    </View>
                                </View>
                            ))}

                            {/* Add Delivery Button */}
                            <TouchableOpacity
                                style={styles.addDeliveryButton}
                                onPress={() => addDelivery(destIndex)}
                            >
                                <Ionicons name="add-circle-outline" size={18} color="#fff" />
                                <Text style={styles.addDeliveryText}>Add Delivery</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    {/* Add Destination Button */}
                    <TouchableOpacity
                        style={styles.addDestinationButton}
                        onPress={addDestination}
                    >
                        <Ionicons name="add" size={20} color="#fff" />
                        <Text style={styles.addDestinationText}>Add Another Destination</Text>
                    </TouchableOpacity>

                    {/* Optimize Button */}
                    <TouchableOpacity
                        style={styles.optimizeButton}
                        onPress={handleOptimize}
                    >
                        <Ionicons name="analytics" size={24} color="#fff" />
                        <Text style={styles.buttonText}>Optimize Transport Plan</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121b2e',
    },
    header: {
        backgroundColor: '#192841',
        padding: 16,
        paddingTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#263c5a',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#8a9bae',
        marginTop: 4,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    addWarehouseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    formContainer: {
        backgroundColor: '#192841',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 16,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 12,
    },
    inputLabel: {
        fontSize: 14,
        color: '#8a9bae',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#253958',
        borderRadius: 6,
        height: 46,
        paddingHorizontal: 12,
        color: '#ffffff',
        marginBottom: 12,
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    pickerContainer: {
        backgroundColor: '#253958',
        borderRadius: 6,
        height: 46,
        marginBottom: 12,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    picker: {
        backgroundColor: '#253958',
        color: '#ffffff',
        marginTop: -10,
    },
    destinationContainer: {
        backgroundColor: '#1e3254',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    destinationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    destinationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    subSectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#ffffff',
        marginTop: 8,
        marginBottom: 10,
    },
    deliveryContainer: {
        backgroundColor: '#243761',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    deliveryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    deliveryTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
    addDeliveryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2c3e5a',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    addDeliveryText: {
        color: '#ffffff',
        fontSize: 14,
        marginLeft: 6,
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
    optimizeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#27ae60',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
});