import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const AddWarehouse: React.FC = () => {
    const [name, setName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [initialRegion, setInitialRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    // Fix the type error by using boolean instead of null
    const [locationPermission, setLocationPermission] = useState<boolean | undefined>(undefined);
    const [mapReady, setMapReady] = useState(false);
    const router = useRouter();

    // Request location permissions and get current location
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            setLocationPermission(status === 'granted');
            
            if (status === 'granted') {
                try {
                    let location = await Location.getCurrentPositionAsync({});
                    const { latitude, longitude } = location.coords;
                    
                    setInitialRegion({
                        latitude,
                        longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    });
                    
                    // Set initial marker position
                    setLatitude(latitude.toString());
                    setLongitude(longitude.toString());
                } catch (error) {
                    console.error("Error getting location:", error);
                    Toast.show({
                        type: 'info',
                        position: 'top',
                        text1: 'Location Services',
                        text2: 'Could not get your current location. Please place the marker manually.',
                    });
                }
            }
        })();
    }, []);

    const handleMapPress = (event: any) => {
        const { coordinate } = event.nativeEvent;
        setLatitude(coordinate.latitude.toString());
        setLongitude(coordinate.longitude.toString());
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Validation Error',
                text2: 'Please enter a warehouse name',
            });
            return;
        }

        if (!latitude || !longitude) {
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Validation Error',
                text2: 'Please select a location on the map',
            });
            return;
        }

        const warehouseData = {
            name,
            lat: parseFloat(latitude),
            lng: parseFloat(longitude),
        };

        try {
            const response = await fetch("http://52.87.170.241:3000/api/logistics/warehouses/index", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(warehouseData),
            });

            if (response.ok) {
                await response.json();

                Toast.show({
                    type: 'success',
                    position: 'bottom',
                    text1: 'Warehouse Added Successfully',
                    text2: 'The warehouse has been added.',
                });

                setTimeout(() => {
                    router.push('/ManageLocations')
                }, 1000);
            } else {
                const errorText = await response.text();

                Toast.show({
                    type: 'error',
                    position: 'bottom',
                    text1: 'Failed to Add Warehouse',
                    text2: errorText || 'Something went wrong.',
                });
            }
        } catch (error) {
            console.error("Error while submitting warehouse data:", error);

            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error',
                text2: 'An error occurred while submitting.',
            });
        }
    };

    const handleManageWarehouses = () => {
        router.push('/ManageLocations');
    };

    const onMapReady = () => {
        setMapReady(true);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Add Warehouse</Text>
                <Text style={styles.headerSubtitle}>Enter warehouse details and select location</Text>
            </View>

            {/* Form */}
            <View style={styles.content}>
                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Warehouse Information</Text>

                    {/* Name Input */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.inputLabel}>Warehouse Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter warehouse name"
                            placeholderTextColor="#8a9bae"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    {/* Map View */}
                    <View style={styles.mapSectionContainer}>
                        <Text style={styles.inputLabel}>Warehouse Location (Tap to Place Marker)</Text>
                        <View style={styles.mapContainer}>
                            {initialRegion.latitude !== 0 && (
                                <MapView
                                    style={styles.map}
                                    initialRegion={initialRegion}
                                    onPress={handleMapPress}
                                    onMapReady={onMapReady}
                                >
                                    {latitude && longitude && (
                                        <Marker
                                            coordinate={{
                                                latitude: parseFloat(latitude),
                                                longitude: parseFloat(longitude),
                                            }}
                                            title="Warehouse Location"
                                            draggable
                                            onDragEnd={(e) => {
                                                setLatitude(e.nativeEvent.coordinate.latitude.toString());
                                                setLongitude(e.nativeEvent.coordinate.longitude.toString());
                                            }}
                                        />
                                    )}
                                </MapView>
                            )}
                        </View>
                        
                        {/* Display Selected Coordinates */}
                        {latitude && longitude && (
                            <View style={styles.coordinatesContainer}>
                                <Text style={styles.coordinatesText}>
                                    Selected: {parseFloat(latitude).toFixed(6)}, {parseFloat(longitude).toFixed(6)}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Save Warehouse Button */}
                    <TouchableOpacity style={styles.addDestinationButton} onPress={handleSubmit}>
                        <Ionicons name="add-circle-outline" size={20} color="#ffffff" />
                        <Text style={styles.addDestinationText}>Save Warehouse</Text>
                    </TouchableOpacity>

                    {/* Manage Warehouses Button */}
                    <TouchableOpacity style={styles.manageButton} onPress={handleManageWarehouses}>
                        <Ionicons name="location-outline" size={20} color="#ffffff" />
                        <Text style={styles.manageText}>Manage Warehouses</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Toast component */}
            <Toast />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121b2e",
    },
    header: {
        backgroundColor: "#192841",
        padding: 16,
        paddingTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#263c5a",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#ffffff",
    },
    headerSubtitle: {
        fontSize: 14,
        color: "#8a9bae",
        marginTop: 4,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    formContainer: {
        backgroundColor: "#192841",
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 16,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    mapSectionContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        color: "#8a9bae",
        marginBottom: 6,
    },
    input: {
        backgroundColor: "#253958",
        borderRadius: 6,
        height: 46,
        paddingHorizontal: 12,
        color: "#ffffff",
        marginBottom: 12,
    },
    mapContainer: {
        height: 250,
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#253958",
    },
    map: {
        width: '100%',
        height: '100%',
    },
    coordinatesContainer: {
        backgroundColor: "#253958",
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
    },
    coordinatesText: {
        color: "#ffffff",
        fontSize: 12,
        textAlign: 'center',
    },
    addDestinationButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2980b9",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    addDestinationText: {
        color: "#ffffff",
        fontWeight: "bold",
        marginLeft: 8,
    },
    manageButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#27ae60",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    manageText: {
        color: "#ffffff",
        fontWeight: "bold",
        marginLeft: 8,
    },
});

export default AddWarehouse;