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
} from "react-native";
import Container3D from "./Container3D";

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
    // setStep(2);
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
        "http://172.28.6.189:3000/packing-prediction",
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
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f5f5f5" }}>
      {pageStep === 1 && (
        // 📌 Step 1: Form UI
        <View
          style={{ backgroundColor: "#ffffff", padding: 20, borderRadius: 10 }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
            Packing Details
          </Text>

          <Text style={{ fontSize: 16, marginBottom: 5 }}>Material ID:</Text>
          <Picker
            selectedValue={materialId}
            onValueChange={(itemValue) => setMaterialId(itemValue)}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              marginBottom: 10,
              backgroundColor: "#fff",
            }}
          >
            <Picker.Item label="Select Material" value="" />
            {GARMENT_BOXES.map((item) => (
              <Picker.Item
                key={item.material_id}
                label={`${item.material} - ${item.size} (${item.material_id})`}
                value={item.material_id}
              />
            ))}
          </Picker>

          <Text style={{ fontSize: 16, marginBottom: 5 }}>Quantity:</Text>
          <TextInput
            value={quantity}
            onChangeText={(text) => {
              // Ensure that the value is a valid positive number and not 0 or negative
              if (text === "" || /^[1-9]\d*$/.test(text)) {
                // RegEx allows only numbers greater than 0
                setQuantity(text);
              }
            }}
            placeholder="Enter quantity"
            keyboardType="numeric"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              marginBottom: 10,
              backgroundColor: "#fff",
            }}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <Text style={{ fontSize: 16, marginRight: 10 }}>
              Allow Rotation:
            </Text>
            <Switch value={allowRotation} onValueChange={setAllowRotation} />
          </View>

          <Button title="Add Box Type" onPress={addBoxType} color="#007BFF" />

          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={{ marginTop: 15 }}
          >
            <Text style={{ fontSize: 18 }}>
              Added Groups: {boxData.length}{" "}
              {boxData.length > 0 && "(Click to view)"}
            </Text>
          </TouchableOpacity>

          {/* Modal to show added box types */}
          <Modal
            visible={showModal}
            animationType="slide"
            onRequestClose={() => setShowModal(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 20,
                  borderRadius: 10,
                  width: "80%",
                }}
              >
                <Text
                  style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}
                >
                  Added Box Types
                </Text>
                {boxData.map((item, index) => (
                  <Text key={index} style={{ fontSize: 18 }}>
                    📦 {item.material_id} - {item.quantity} pcs (Rotation:{" "}
                    {item.allow_rotation ? "Yes" : "No"})
                  </Text>
                ))}
                <Button
                  title="Close"
                  onPress={() => setShowModal(false)}
                  color="#FF6347"
                />
              </View>
            </View>
          </Modal>

          <Text style={{ fontSize: 16, marginTop: 20, marginBottom: 5 }}>
            Select Container:
          </Text>
          {CONTAINERS.map((container) => (
            <TouchableOpacity
              key={container.type}
              style={{
                padding: 10,
                backgroundColor:
                  selectedContainer === container.type ? "#007BFF" : "#ddd",
                marginVertical: 5,
                borderRadius: 5,
              }}
              onPress={() => setSelectedContainer(container.type)}
            >
              <Text
                style={{
                  color: selectedContainer === container.type ? "#fff" : "#000",
                }}
              >
                {container.type}
              </Text>
            </TouchableOpacity>
          ))}

          <Button
            title="Next"
            onPress={handleSubmit}
            color="#28A745"
            style={{ marginTop: 20, marginBottom: 20 }}
          />

          <TouchableOpacity
            onPress={resetForm}
            style={{
              backgroundColor: "#A9D6E5", // Light red color
              paddingVertical: 10,
              paddingHorizontal: 30,
              borderRadius: 20, // Rounded corners
              alignItems: "center",
              marginTop: 15, // Adds some space from the Start Packing button
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {pageStep === 2 && (
        // 📌 Step 2: Summary
        <View style={{ flex: 1, padding: 20, backgroundColor: "#f5f5f5" }}>
          <View
            style={{
              backgroundColor: "#ffffff",
              padding: 20,
              borderRadius: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold", 
                marginBottom: 20,
                color: "#333",
              }}
            >
              Packing Summary
            </Text>

            {/* Box Data List */}
            {boxData.map((item, index) => (
              <View
                key={index}
                style={{
                  marginBottom: 15,
                  padding: 15,
                  backgroundColor: "#f8f9fa",
                  borderRadius: 10,
                  borderLeftWidth: 5,
                  borderLeftColor: "#007BFF",
                }}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}
                >
                  📦 {item.material_id}
                </Text>
                <Text style={{ fontSize: 16, color: "#555" }}>
                  Quantity: {item.quantity} pcs
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: item.allow_rotation ? "#28A745" : "#FF6347",
                  }}
                >
                  Rotation: {item.allow_rotation ? "Allowed" : "Not Allowed"}
                </Text>
              </View>
            ))}

            {/* Container Selection */}
            <View style={{ marginTop: 20 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 10,
                  color: "#333",
                }}
              >
                Selected Container:
              </Text>
              <View
                style={{
                  padding: 10,
                  backgroundColor: "#e9ecef",
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontSize: 16, color: "#007BFF" }}>
                  {selectedContainer}
                </Text>
              </View>
            </View>

            {/* Start Packing Button */}
            <View
              style={{ marginTop: 20, alignItems: "center", marginBottom: 20 }}
            >
              <TouchableOpacity
                onPress={() => setPageStep(3)}
                style={{
                  backgroundColor: "#28A745",
                  paddingVertical: 15,
                  paddingHorizontal: 40,
                  borderRadius: 30,
                  elevation: 5,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}
                >
                  Start Packing
                </Text>
              </TouchableOpacity>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity
              onPress={resetForm}
              style={{
                backgroundColor: "#A9D6E5", // Light red color
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 20, // Rounded corners
                alignItems: "center",
                marginTop: 15, // Adds some space from the Start Packing button
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {pageStep === 3 && (
        <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            Step {currentStep + 1}
          </Text>
  
          {/* Display the current instruction */}
          {instructions.length > 0 && instructions[currentStep] && (
            <View style={{ marginVertical: 20, alignItems: "center" }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
               {instructions[currentStep].steps[0].instruction}
              </Text>
  
              {/* Display the 3D model */}
              <Container3D instructions={instructions} currentStep={currentStep} />
              {/* <Container3D/> */}
            </View>
          )}
  
          {/* Buttons to navigate through steps */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
            <TouchableOpacity
              onPress={() => setCurrentStep(currentStep > 0 ? currentStep - 1 : currentStep)} // Go to previous step
              style={styles.stepButton}
            >
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              onPress={() => {
                // Go to next step or reset if at the last step
                if (currentStep < instructions.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  // All steps completed, show success message or navigate to another screen
                  Alert.alert("Packing Complete", "The packing plan has been completed!");
                }
              }}
              style={styles.stepButton}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
  
          {/* Cancel Button */}
          <TouchableOpacity onPress={resetForm} style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
      )}
    </View>
  );
}

const styles = {
  stepButton: {
    backgroundColor: "#A9D6E5", // Light blue color
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  cancelButton: {
    backgroundColor: "#FF6347", // Red color for Cancel
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 15,
  },
};

