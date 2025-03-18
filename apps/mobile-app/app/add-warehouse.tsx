import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AddWarehouse: React.FC = () => {
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleSubmit = () => {
    console.log({ name, latitude, longitude });
    // Handle submission logic here
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

          {/* Submit Button */}
          <TouchableOpacity style={styles.addDestinationButton} onPress={handleSubmit}>
            <Ionicons name="add-circle-outline" size={20} color="#ffffff" />
            <Text style={styles.addDestinationText}>Save Warehouse</Text>
          </TouchableOpacity>
        </View>
      </View>
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
});

export default AddWarehouse;
