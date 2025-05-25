import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet
} from "react-native";
import Container3D from "./Container3D";
import { Ionicons } from "@expo/vector-icons";

// Predefined container types
const CONTAINERS = [
  { type: "Small", size: [100, 100, 100], max_weight: 100 },
  { type: "Medium", size: [150, 150, 150], max_weight: 200 },
  { type: "Large", size: [200, 200, 200], max_weight: 500 },
];

// Predefined box materials
const GARMENT_BOXES = [
  {
    material_id: "1-small",
    material: "Cotton",
    size: [20, 15, 10],
    weight: 10,
    color: "red",
    max_weight_upright: 50,
    max_weight_rotated: 30,
  },
  {
    material_id: "1-medium",
    material: "Cotton",
    size: [30, 20, 15],
    weight: 12,
    color: "red",
    max_weight_upright: 60,
    max_weight_rotated: 40,
  },
  {
    material_id: "1-large",
    material: "Cotton",
    size: [40, 30, 20],
    weight: 15,
    color: "red",
    max_weight_upright: 80,
    max_weight_rotated: 50,
  },
  {
    material_id: "2-small",
    material: "Silk",
    size: [25, 20, 15],
    weight: 8,
    color: "blue",
    max_weight_upright: 40,
    max_weight_rotated: 25,
  },
  {
    material_id: "2-medium",
    material: "Silk",
    size: [35, 25, 20],
    weight: 10,
    color: "blue",
    max_weight_upright: 50,
    max_weight_rotated: 30,
  },
  {
    material_id: "2-large",
    material: "Silk",
    size: [45, 35, 25],
    weight: 13,
    color: "blue",
    max_weight_upright: 70,
    max_weight_rotated: 40,
  },
  {
    material_id: "3-small",
    material: "Denim",
    size: [30, 25, 20],
    weight: 12,
    color: "green",
    max_weight_upright: 70,
    max_weight_rotated: 50,
  },
  {
    material_id: "3-medium",
    material: "Denim",
    size: [40, 30, 25],
    weight: 14,
    color: "green",
    max_weight_upright: 90,
    max_weight_rotated: 60,
  },
  {
    material_id: "3-large",
    material: "Denim",
    size: [50, 40, 30],
    weight: 18,
    color: "green",
    max_weight_upright: 120,
    max_weight_rotated: 80,
  },
];

export default function PackingScreen() {
  const [boxData, setBoxData] = useState([]);
  const [materialId, setMaterialId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [allowRotation, setAllowRotation] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState(
    CONTAINERS[0].type
  );
  const [pageStep, setPageStep] = useState(1); // Step 1: Form, Step 2: Summary, Step 3: 3D UI
  const [showModal, setShowModal] = useState(false);
  const [instructions, setInstructions] = useState();

  const [currentStep, setCurrentStep] = useState(0); // To track the current step
  

  // Add new box type
  const addBoxType = () => {
    if (!materialId || !quantity) {
      alert("Please enter material ID and quantity.");
      return;
    }

    // Check if material ID is already added
    const isMaterialIdAlreadyAdded = boxData.some(
      (item) => item.material_id === materialId
    );
    if (isMaterialIdAlreadyAdded) {
      alert("This material ID has already been added.");
      return;
    }

    const newBox = {
      material_id: materialId,
      quantity: Number(quantity),
      allow_rotation: allowRotation,
    };

    setBoxData([...boxData, newBox]);
    setMaterialId("");
    setQuantity("");
    setAllowRotation(false);
  };

  // Submit form and move to summary step
  const handleSubmit = () => {
    if (boxData.length === 0) {
      alert("Please add at least one box type.");
      return;
    }
    // setPageStep(2);
    startPacking();
  };

  const resetForm = () => {
    setBoxData([]);
    setMaterialId("");
    setQuantity("");
    setAllowRotation(false);
    setSelectedContainer(CONTAINERS[0].type);
    setPageStep(1);
  };

  const startPacking = async () => {
    const requestBody = {
      box_data: boxData,
      container_type: selectedContainer,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:5001/packing-prediction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store instructions in the state
        setInstructions(data[0].plan);
        setPageStep(2); // Move to step 3
      } else {
        Alert.alert("Error", "There was an error with the packing request.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        `Failed to connect to the server due to ${error.message}`
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Packing Management</Text>
        <Text style={styles.headerSubtitle}>Optimize your packing strategy</Text>
      </View>

      <ScrollView style={styles.content}>
        {pageStep === 1 && (
          // Step 1: Form UI
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Packing Details</Text>

            <View style={styles.sectionContainer}>
              <Text style={styles.inputLabel}>Material ID:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={materialId}
                  onValueChange={(itemValue) => setMaterialId(itemValue)}
                  style={styles.picker}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item label="Select Material" value="" color="#000" />
                  {GARMENT_BOXES.map((item) => (
                    <Picker.Item
                      key={item.material_id}
                      label={`${item.material} - ${item.size} (${item.material_id})`}
                      value={item.material_id}
                      color="#000"
                    />
                  ))}
                </Picker>
              </View>

              <Text style={styles.inputLabel}>Quantity:</Text>
              <TextInput
                value={quantity}
                onChangeText={(text) => {
                  if (text === "" || /^[1-9]\d*$/.test(text)) {
                    setQuantity(text);
                  }
                }}
                placeholder="Enter quantity"
                placeholderTextColor="#8a9bae"
                keyboardType="numeric"
                style={styles.input}
              />

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Allow Rotation:</Text>
                <Switch 
                  value={allowRotation} 
                  onValueChange={setAllowRotation}
                  trackColor={{ false: '#2c3e50', true: '#27ae60' }}
                  thumbColor={allowRotation ? '#ffffff' : '#8a9bae'}
                />
              </View>

              <TouchableOpacity
                onPress={addBoxType}
                style={styles.addButton}
              >
                <Ionicons name="add-circle" size={20} color="#fff" />
                <Text style={styles.buttonText}>Add Box Type</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowModal(true)}
                style={styles.viewGroupsButton}
              >
                <Ionicons name="eye" size={20} color="#fff" />
                <Text style={styles.buttonText}>
                  Added Groups: {boxData.length} {boxData.length > 0 && "(Click to view)"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Modal */}
            <Modal
              visible={showModal}
              animationType="slide"
              onRequestClose={() => setShowModal(false)}
            >
              <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Added Box Types</Text>
                  <ScrollView style={styles.modalList}>
                    {boxData.map((item, index) => (
                      <View key={index} style={styles.modalItem}>
                        <Text style={styles.modalItemText}>
                          📦 {item.material_id} - {item.quantity} pcs
                        </Text>
                        <Text style={styles.modalItemSubtext}>
                          Rotation: {item.allow_rotation ? "Yes" : "No"}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                  <TouchableOpacity
                    onPress={() => setShowModal(false)}
                    style={styles.closeModalButton}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </Modal>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Select Container:</Text>
              {CONTAINERS.map((container) => (
                <TouchableOpacity
                  key={container.type}
                  style={[
                    styles.containerOption,
                    selectedContainer === container.type && styles.containerOptionSelected
                  ]}
                  onPress={() => setSelectedContainer(container.type)}
                >
                  <Text style={[
                    styles.containerOptionText,
                    selectedContainer === container.type && styles.containerOptionTextSelected
                  ]}>
                    {container.type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.nextButton}
              >
                <Ionicons name="arrow-forward" size={20} color="#fff" />
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={resetForm}
                style={styles.cancelButton}
              >
                <Ionicons name="close" size={20} color="#fff" />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {pageStep === 2 && (
          // Step 2: Summary
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Packing Summary</Text>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Box Data</Text>
              {boxData.map((item, index) => (
                <View key={index} style={styles.summaryItem}>
                  <View style={styles.summaryHeader}>
                    <Text style={styles.summaryTitle}>📦 {item.material_id}</Text>
                  </View>
                  <Text style={styles.summaryText}>Quantity: {item.quantity} pcs</Text>
                  <Text style={[
                    styles.summaryText,
                    { color: item.allow_rotation ? '#27ae60' : '#e74c3c' }
                  ]}>
                    Rotation: {item.allow_rotation ? "Allowed" : "Not Allowed"}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Selected Container</Text>
              <View style={styles.containerSummary}>
                <Text style={styles.containerSummaryText}>{selectedContainer}</Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => setPageStep(3)}
                style={styles.startPackingButton}
              >
                <Ionicons name="play" size={20} color="#fff" />
                <Text style={styles.buttonText}>Start Packing</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={resetForm}
                style={styles.cancelButton}
              >
                <Ionicons name="close" size={20} color="#fff" />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {pageStep === 3 && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Step {currentStep + 1}</Text>

            {instructions.length > 0 && instructions[currentStep] && (
              <View style={styles.instructionContainer}>
                <Text style={styles.instructionText}>
                  {instructions[currentStep].steps[0].instruction}
                </Text>

                {/* Your 3D Container component would go here */}
                {/* <Container3D instructions={instructions} currentStep={currentStep} /> */}
                <View style={styles.placeholder3D}>
                  <Ionicons name="cube" size={48} color="#8a9bae" />
                  <Text style={styles.placeholderText}>3D Model View</Text>
                </View>
              </View>
            )}

            <View style={styles.stepButtonRow}>
              <TouchableOpacity
                onPress={() => setCurrentStep(currentStep > 0 ? currentStep - 1 : currentStep)}
                style={styles.stepButton}
              >
                <Ionicons name="chevron-back" size={20} color="#fff" />
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (currentStep < instructions.length - 1) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    Alert.alert("Packing Complete", "The packing plan has been completed!");
                  }
                }}
                style={styles.stepButton}
              >
                <Text style={styles.buttonText}>Next</Text>
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={resetForm}
              style={styles.cancelButtonFull}
            >
              <Ionicons name="close" size={20} color="#fff" />
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: '#ffffff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  viewGroupsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  containerOption: {
    backgroundColor: '#253958',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 8,
  },
  containerOptionSelected: {
    backgroundColor: '#2980b9',
  },
  containerOptionText: {
    color: '#8a9bae',
    fontSize: 16,
  },
  containerOptionTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
  },
  startPackingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
  },
  cancelButtonFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#121b2e',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#192841',
    margin: 20,
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  modalList: {
    flex: 1,
  },
  modalItem: {
    backgroundColor: '#253958',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  modalItemText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalItemSubtext: {
    color: '#8a9bae',
    fontSize: 14,
    marginTop: 4,
  },
  closeModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  // Summary styles
  summaryItem: {
    backgroundColor: '#1e3254',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  summaryHeader: {
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  summaryText: {
    fontSize: 14,
    color: '#8a9bae',
    marginBottom: 4,
  },
  containerSummary: {
    backgroundColor: '#253958',
    padding: 12,
    borderRadius: 6,
  },
  containerSummaryText: {
    fontSize: 16,
    color: '#2980b9',
    fontWeight: 'bold',
  },
  // Step 3 styles
  instructionContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  placeholder3D: {
    backgroundColor: '#253958',
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  placeholderText: {
    color: '#8a9bae',
    fontSize: 16,
    marginTop: 8,
  },
  stepButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  stepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
  }
})


