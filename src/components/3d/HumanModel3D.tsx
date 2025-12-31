import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

interface HumanModel3DProps {
  productImage: string;
  productColor?: string;
}

// Vietnamese model person with clothing
function HumanMesh({ productImage, productColor = "#1a1a1a" }: { productImage: string; productColor: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load product texture
  const productTexture = useMemo(() => {
    const texture = new THREE.TextureLoader().load(productImage);
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, [productImage]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  const skinColor = "#d4a574"; // Vietnamese skin tone
  const hairColor = "#1a1a1a";
  const pantsColor = "#2d3748";

  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      {/* Head */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 1.85, -0.02]}>
        <sphereGeometry args={[0.23, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={hairColor} roughness={0.8} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.07, 1.72, 0.18]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.07, 1.72, 0.18]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.15, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      
      {/* Torso with product texture (T-shirt) */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.28, 0.25, 0.75, 16]} />
        <meshStandardMaterial 
          map={productTexture}
          color={productColor}
          roughness={0.7}
        />
      </mesh>
      
      {/* Lower torso */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.25, 0.22, 0.2, 16]} />
        <meshStandardMaterial color={productColor} roughness={0.7} />
      </mesh>
      
      {/* Arms */}
      {/* Left arm upper */}
      <mesh position={[-0.38, 1.15, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.07, 0.08, 0.35, 16]} />
        <meshStandardMaterial color={productColor} roughness={0.7} />
      </mesh>
      {/* Left arm lower */}
      <mesh position={[-0.52, 0.88, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.06, 0.07, 0.35, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      {/* Left hand */}
      <mesh position={[-0.58, 0.68, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      
      {/* Right arm upper */}
      <mesh position={[0.38, 1.15, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.07, 0.08, 0.35, 16]} />
        <meshStandardMaterial color={productColor} roughness={0.7} />
      </mesh>
      {/* Right arm lower */}
      <mesh position={[0.52, 0.88, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.06, 0.07, 0.35, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      {/* Right hand */}
      <mesh position={[0.58, 0.68, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      
      {/* Pants/Legs */}
      {/* Left leg */}
      <mesh position={[-0.12, 0.2, 0]}>
        <cylinderGeometry args={[0.1, 0.09, 0.5, 16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.8} />
      </mesh>
      <mesh position={[-0.12, -0.2, 0]}>
        <cylinderGeometry args={[0.09, 0.08, 0.4, 16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.8} />
      </mesh>
      
      {/* Right leg */}
      <mesh position={[0.12, 0.2, 0]}>
        <cylinderGeometry args={[0.1, 0.09, 0.5, 16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.12, -0.2, 0]}>
        <cylinderGeometry args={[0.09, 0.08, 0.4, 16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.8} />
      </mesh>
      
      {/* Feet */}
      <mesh position={[-0.12, -0.45, 0.05]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.1, 0.08, 0.18]} />
        <meshStandardMaterial color="#4a5568" roughness={0.9} />
      </mesh>
      <mesh position={[0.12, -0.45, 0.05]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.1, 0.08, 0.18]} />
        <meshStandardMaterial color="#4a5568" roughness={0.9} />
      </mesh>
    </group>
  );
}

export default function HumanModel3D({ productImage, productColor = "#1a1a1a" }: HumanModel3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 3], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.4} />
      
      <HumanMesh productImage={productImage} productColor={productColor} />
      
      <ContactShadows
        position={[0, -1.6, 0]}
        opacity={0.4}
        scale={3}
        blur={2}
        far={2}
      />
      
      <Environment preset="studio" />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2}
        maxDistance={5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
      />
    </Canvas>
  );
}
