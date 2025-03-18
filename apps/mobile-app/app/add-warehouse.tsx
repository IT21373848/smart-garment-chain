import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message'; // Import toast

const AddWarehouse: React.FC = () => {
    const [name, setName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const router = useRouter();

    const handleSubmit = async () => {
        const warehouseData = {
            name,
            lat: parseFloat(latitude),
            lng: parseFloat(longitude),
        };

        try {
            const response = await fetch("http://192.168.43.89:3000/api/logistics/warehouses/index", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(warehouseData),
            });

            if (response.ok) {
                const responseData = await response.json();

                // Show success toast message
                Toast.show({
                    type: 'success',
                    position: 'bottom',
                    text1: 'Warehouse Added Successfully',
                    text2: 'The warehouse has been added.',
                });

                // Navigate to transport page after a short delay
                setTimeout(() => {
                    router.push('/ManageLocations')
                }, 1000);
            } else {
                const errorText = await response.text();

                // Show error toast message
                Toast.show({
                    type: 'error',
                    position: 'bottom',
                    text1: 'Failed to Add Warehouse',
                    text2: errorText || 'Something went wrong.',
                });
            }
        } catch (error) {
            console.error("Error while submitting warehouse data:", error);

            // Show error toast message
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error',
                text2: 'An error occurred while submitting.',
            });
        }
    };

    // New handle for "Manage Warehouses" button
    const handleManageWarehouses = () => {
        router.push('/ManageLocations');
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Add Warehouse</Text>
                <Text style={styles.headerSubtitle}>Enter warehouse details below</Text>
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

                    {/* Latitude & Longitude */}
                    <View style={styles.rowInputs}>
                        <View style={[styles.sectionContainer, styles.halfInput]}>
                            <Text style={styles.inputLabel}>Latitude</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter latitude"
                                placeholderTextColor="#8a9bae"
                                value={latitude}
                                onChangeText={setLatitude}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={[styles.sectionContainer, styles.halfInput]}>
                            <Text style={styles.inputLabel}>Longitude</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter longitude"
                                placeholderTextColor="#8a9bae"
                                value={longitude}
                                onChangeText={setLongitude}
                                keyboardType="numeric"
                            />
                        </View>
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
    rowInputs: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    halfInput: {
        width: "48%",
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
    // New style for the Manage Warehouses button
    manageButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#27ae60", // Green color for this button
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
