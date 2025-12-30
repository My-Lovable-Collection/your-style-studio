import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

interface TShirtModelProps {
  color?: string;
  customText?: string;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  isBold?: boolean;
  isItalic?: boolean;
  uploadedImage?: string | null;
  rotation?: number;
  scale?: number;
}

function TShirtMesh({
  color = "#1a1a1a",
  customText,
  textColor = "#ffffff",
  fontSize = 24,
  isBold = false,
  uploadedImage,
  rotation = 0,
  scale = 100,
}: TShirtModelProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  // Create canvas texture for custom design
  const designTexture = useRef<THREE.CanvasTexture | null>(null);
  
  if (customText || uploadedImage) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      ctx.fillStyle = "transparent";
      ctx.clearRect(0, 0, 512, 512);
      
      // Apply rotation and scale
      ctx.save();
      ctx.translate(256, 256);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale / 100, scale / 100);
      ctx.translate(-256, -256);
      
      if (uploadedImage) {
        const img = new Image();
        img.src = uploadedImage;
        if (img.complete) {
          const size = 200;
          ctx.drawImage(img, 256 - size / 2, 256 - size / 2, size, size);
        }
      }
      
      if (customText) {
        ctx.fillStyle = textColor;
        ctx.font = `${isBold ? "bold" : "normal"} ${fontSize * 2}px Inter`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(customText, 256, 256);
      }
      
      ctx.restore();
      
      designTexture.current = new THREE.CanvasTexture(canvas);
      designTexture.current.needsUpdate = true;
    }
  }

  return (
    <group
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main body - front */}
      <mesh position={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[1.6, 2, 0.1]} />
        <meshStandardMaterial
          color={color}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Main body - back */}
      <mesh position={[0, 0, -0.15]} castShadow>
        <boxGeometry args={[1.6, 2, 0.1]} />
        <meshStandardMaterial
          color={color}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Left side */}
      <mesh position={[-0.8, 0, 0]} castShadow>
        <boxGeometry args={[0.05, 2, 0.35]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Right side */}
      <mesh position={[0.8, 0, 0]} castShadow>
        <boxGeometry args={[0.05, 2, 0.35]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Left sleeve */}
      <mesh position={[-1.1, 0.6, 0]} rotation={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[0.6, 0.5, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Right sleeve */}
      <mesh position={[1.1, 0.6, 0]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.6, 0.5, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Collar */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.15, 32]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Design overlay on front */}
      {designTexture.current && (
        <mesh position={[0, 0.2, 0.21]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={designTexture.current}
            transparent
            opacity={0.9}
          />
        </mesh>
      )}
      
      {/* Highlight effect on hover */}
      {hovered && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.7, 2.1, 0.5]} />
          <meshBasicMaterial
            color="#B8860B"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
}

interface ProductModel3DProps {
  productColor?: string;
  customText?: string;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  isBold?: boolean;
  isItalic?: boolean;
  uploadedImage?: string | null;
  rotation?: number;
  scale?: number;
}

export default function ProductModel3D({
  productColor = "#1a1a1a",
  customText,
  textColor,
  fontSize,
  fontFamily,
  isBold,
  isItalic,
  uploadedImage,
  rotation,
  scale,
}: ProductModel3DProps) {
  return (
    <div className="h-full w-full">
      <Canvas
        shadows
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <spotLight
          position={[5, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <spotLight
          position={[-5, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
        />
        
        <TShirtMesh
          color={productColor}
          customText={customText}
          textColor={textColor}
          fontSize={fontSize}
          fontFamily={fontFamily}
          isBold={isBold}
          isItalic={isItalic}
          uploadedImage={uploadedImage}
          rotation={rotation}
          scale={scale}
        />
        
        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.4}
          scale={5}
          blur={2.5}
        />
        
        <Environment preset="city" />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
      
      {/* Instructions overlay */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
        <span className="rounded-full bg-background/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
          Drag to rotate • Scroll to zoom
        </span>
      </div>
    </div>
  );
}
