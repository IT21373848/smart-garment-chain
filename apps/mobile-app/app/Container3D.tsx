import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";

const Container3D = ({ instructions, currentStep }) => {
  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    console.log("GL Context Created");
    console.log("instructions", instructions);
    console.log("currentStep", currentStep);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x253958);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(50, 50, 200);

    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(0x253958, 1);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.set(100, 100, 100);
    scene.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(-50, 50, 100);
    scene.add(directionalLight);

    const currentInstructionGroup = instructions[currentStep];
    if (!currentInstructionGroup || !Array.isArray(currentInstructionGroup.steps)) {
      console.log("Invalid instruction group for this step.");
      return;
    }

    const boxes = currentInstructionGroup.steps.map(({ position, type }, index) => {
      const geometry = new THREE.BoxGeometry(50, 50, 50);
      let boxColor;
      switch (type) {
        case "Type-2-medium":
          boxColor = 0x2980b9;
          break;
        case "Type-1-small":
          boxColor = 0x27ae60;
          break;
        default:
          boxColor = 0xe74c3c;
      }

      const material = new THREE.MeshStandardMaterial({
        color: boxColor,
        metalness: 0.3,
        roughness: 0.4,
      });

      const box = new THREE.Mesh(geometry, material);
      box.position.set(
        position?.x?.value ?? position?.x ?? 0,
        position?.y?.value ?? position?.y ?? 0,
        position?.z?.value ?? position?.z ?? 0
      );

      const wireframeGeometry = new THREE.EdgesGeometry(geometry);
      const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x8a9bae });
      const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
      box.add(wireframe);

      scene.add(box);
      return box;
    });

    let frameId;
    const renderLoop = () => {
      frameId = requestAnimationFrame(renderLoop);
      boxes.forEach((box) => (box.rotation.y += 0.01));
      renderer.render(scene, camera);
      gl.flush();
      gl.endFrameEXP();
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(frameId);
      console.log("GL Context Destroyed");
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          3D Box Arrangement - Step {currentStep + 1}
        </Text>
      </View>
      <View style={styles.glContainer}>
        <GLView style={styles.glView} onContextCreate={onContextCreate} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#192841', // Theme background
    borderRadius: 8,
    overflow: 'hidden',
  },
  titleContainer: {
    backgroundColor: '#253958', // Darker blue for title section
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#263c5a',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff', // White text
    textAlign: 'center',
  },
  glContainer: {
    flex: 1,
    backgroundColor: '#253958', // Background for GL container
    margin: 8,
    borderRadius: 6,
    overflow: 'hidden',
  },
  glView: {
    flex: 1,
  },
});

export default Container3D;