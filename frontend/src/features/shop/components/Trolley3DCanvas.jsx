import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// Floating low-poly geometric smart scanner / AI core hub
function SceneCore() {
  const groupRef = useRef(null);
  const ringRef1 = useRef(null);
  const ringRef2 = useRef(null);
  const cube1Ref = useRef(null);
  const cube2Ref = useRef(null);
  const cube3Ref = useRef(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.z += delta * 0.4;
      ringRef1.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z -= delta * 0.3;
      ringRef2.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.6) * 0.3;
    }
    if (cube1Ref.current) {
      cube1Ref.current.rotation.x += delta * 0.6;
      cube1Ref.current.rotation.y += delta * 0.4;
    }
    if (cube2Ref.current) {
      cube2Ref.current.rotation.x -= delta * 0.5;
      cube2Ref.current.rotation.z += delta * 0.5;
    }
    if (cube3Ref.current) {
      cube3Ref.current.rotation.y += delta * 0.7;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central AI Core Sphere */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh>
          <sphereGeometry args={[1.1, 32, 32]} />
          <MeshDistortMaterial
            color="#10b981"
            roughness={0.2}
            metalness={0.8}
            distort={0.25}
            speed={1.5}
            emissive="#047857"
            emissiveIntensity={0.4}
          />
        </mesh>
      </Float>

      {/* Holographic Gyroscopic Ring 1 */}
      <mesh ref={ringRef1} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.75, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#34d399"
          emissive="#10b981"
          emissiveIntensity={0.9}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Holographic Gyroscopic Ring 2 */}
      <mesh ref={ringRef2} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[2.05, 0.015, 16, 64]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Orbiting Low-Poly Product Tag / Sensor Nodes */}
      <group position={[1.8, 0.8, 0.5]}>
        <RoundedBox ref={cube1Ref} args={[0.35, 0.35, 0.35]} radius={0.05} smoothness={4}>
          <meshStandardMaterial
            color="#059669"
            emissive="#10b981"
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.3}
          />
        </RoundedBox>
      </group>

      <group position={[-1.7, -0.6, 0.8]}>
        <RoundedBox ref={cube2Ref} args={[0.3, 0.3, 0.3]} radius={0.04} smoothness={4}>
          <meshStandardMaterial
            color="#0284c7"
            emissive="#38bdf8"
            emissiveIntensity={0.6}
            metalness={0.8}
            roughness={0.2}
          />
        </RoundedBox>
      </group>

      <group position={[0.4, -1.6, -0.9]}>
        <RoundedBox ref={cube3Ref} args={[0.25, 0.25, 0.25]} radius={0.03} smoothness={4}>
          <meshStandardMaterial
            color="#6366f1"
            emissive="#818cf8"
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.3}
          />
        </RoundedBox>
      </group>
    </group>
  );
}

export default function Trolley3DCanvas() {
  return (
    <div className="w-full h-full min-h-[380px] sm:min-h-[460px] relative select-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#10b981" />
        <pointLight position={[5, -5, 5]} intensity={0.6} color="#38bdf8" />
        <SceneCore />
      </Canvas>
    </div>
  );
}
