import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Box({
  position,
  size,
  color,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}) {
  const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(...size));
  return (
    <>
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
          color={color}
          metalness={0.4} // Adds slight metallic look
          roughness={0.6} // Adds texture for realism
        />
    </mesh>
    <lineSegments geometry={edges} position={position}>
        <lineBasicMaterial color="black" />
      </lineSegments>
    </>
  );
}

function convertContainerSize(size: string): [number, number, number] {
  switch (size) {
    case "40-Foot":
      return [12.19, 2.44, 2.59];
    case "40-Foot High Cube":
      return [12.19, 2.44, 2.89];
    case "20-Foot":
      return [6.06, 2.44, 2.59];
    case "45-Foot High Cube":
      return [13.71, 2.44, 2.89];
    default:
      return [10, 10, 10];
  }
}

function parseBoxSize(boxSize: string | undefined): [number, number, number] {
  if (!boxSize) return [1, 1, 1];
  const dimensions = boxSize
    .split("x")
    .map((dim) => parseFloat(dim.trim()) / 100);
  return dimensions.length === 3
    ? [dimensions[0], dimensions[1], dimensions[2]]
    : [1, 1, 1];
}

function Container({
  predictedBoxQuantity,
  boxSize,
  containerSize,
}: {
  predictedBoxQuantity: string | undefined;
  boxSize: string | undefined;
  containerSize: string | undefined;
}) {
  const boxDimensions = parseBoxSize(boxSize);
  const containerDimensions = convertContainerSize(containerSize || "");
  const [boxWidth, boxHeight, boxDepth] = boxDimensions;
  const [containerWidth, containerHeight, containerDepth] = containerDimensions;
  const boxes = [];
  let x = -containerWidth / 2 + boxWidth / 2;
  let y = -containerHeight / 2 + boxHeight / 2;
  let z = -containerDepth / 2 + boxDepth / 2;
  for (
    let i = 0;
    i < Math.min(1000, parseInt(predictedBoxQuantity || "0", 10));
    i++
  ) {
    boxes.push({ position: [x, y, z] as [number, number, number] });
    x += boxWidth;
    if (x + boxWidth / 2 > containerWidth / 2) {
      x = -containerWidth / 2 + boxWidth / 2;
      y += boxHeight;
      if (y + boxHeight / 2 > containerHeight / 2) {
        y = -containerHeight / 2 + boxHeight / 2;
        z += boxDepth;
        if (z + boxDepth / 2 > containerDepth / 2) {
          break;
        }
      }
    }
  }

  return (
    <>
      <mesh>
        <boxGeometry args={containerDimensions} />
        <meshBasicMaterial color="green" wireframe />
      </mesh>
      {boxes.map((box, index) => (
        <Box
          key={index}
          position={box.position}
          size={boxDimensions}
          color="red"
        />
      ))}
    </>
  );
}

export default function PackingVisualizer() {
  // Hardcoded data
  const hardcodedData = {
    item: "T-Shirts",
    boxSize: "Extra-Large Box (30 x 20 x 20)",
    quantity: "71",
    containerSize: "40-Foot",
    predictedBoxQuantity: "279.6254285714286",
  };

  return (
    <div className="w-full h-screen bg-gray-400 flex items-center justify-center">
    <main>
      <div>
        <Canvas shadows style={{ height: "600px", width: "1500px", background: "#f0f0f0" }}>
          {/* Global lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 10]} intensity={0.8} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {/* Container and Boxes */}
          <Container
            predictedBoxQuantity={hardcodedData.predictedBoxQuantity}
            boxSize={hardcodedData.boxSize}
            containerSize={hardcodedData.containerSize}
          />

          {/* Controls for interactivity */}
          <OrbitControls />
        </Canvas>
      </div>
    </main>
    </div>
  );
}

