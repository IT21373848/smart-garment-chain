import React, { useRef, useEffect } from "react";
import { View, Text } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";

const Container3D = ({ instructions, currentStep }) => {
  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    console.log("GL Context Created"); // Debugging log

    // Set up the scene
    const scene = new THREE.Scene();

    // Set the background color to white
    scene.background = new THREE.Color(0xffffff); // White background

    // Set up the camera (closer to the objects and with a wider FOV)
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000); // Adjusted FOV
    camera.position.set(50, 50, 200); // Position the camera to view the entire scene

    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 1); // Set clear color to white

    // Add lighting to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft ambient light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(100, 100, 100); // Position the light to illuminate the scene
    scene.add(pointLight);

    // Retrieve the current step's instructions
    const currentInstruction = instructions[currentStep];
    if (!currentInstruction) {
      console.log("No instructions found for this step.");
      return;
    }

    console.log("Current Instructions:", currentInstruction); // Debugging log

    // Create boxes based on instructions
    const boxes = currentInstruction.steps.map(({ position, type }, index) => {
      const geometry = new THREE.BoxGeometry(50, 50, 50); // Increased size of the box
      const material = new THREE.MeshStandardMaterial({
        color: type === "Type-2-medium" ? 0x0000ff : 0xff0000, // Blue for medium, Red for small
      });

      const box = new THREE.Mesh(geometry, material);
      box.position.set(position.x, position.y, position.z); // Set the box's position
      scene.add(box);
      console.log(`Box ${index + 1} added at position:`, position); // Debugging log
      return box;
    });

    // Ensure proper rendering of the scene
    let frameId;
    const renderLoop = () => {
      frameId = requestAnimationFrame(renderLoop);

      // Rotate boxes slightly for better visibility
      boxes.forEach((box) => (box.rotation.y += 0.01));
      renderer.render(scene, camera);
      gl.flush();
      gl.endFrameEXP();
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(frameId); // Cleanup the animation frame on unmount
      console.log("GL Context Destroyed"); // Debugging log
    };
  };

  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 15,
          textAlign: "center",
          marginBottom: 10,
          width: "100%",
        }}
      >
        {`      `} 3D Box Arrangement of the step {`      `}
      </Text>
      <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
    </View>
  );
};

export default Container3D;
