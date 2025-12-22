import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

interface Props {
  open: boolean;
  onClose: () => void;
}

function Planet({
  orbit,
  radius,
  speed,
  color,
}: {
  orbit: number;
  radius: number;
  speed: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const angle = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    angle.current += delta * speed;

    ref.current!.position.set(
      Math.cos(angle.current) * orbit,
      Math.sin(angle.current) * orbit * 0.35,
      Math.sin(angle.current) * orbit
    );
  });

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[radius, 48, 48]} />
      <meshStandardMaterial
        color={color}
        roughness={0.35}
        metalness={0.15}
      />
    </mesh>
  );
}

export default function SolarSystemOverlay3D({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-6 z-10 px-3 py-1.5 text-sm bg-slate-900/90 border border-slate-600 rounded-full text-slate-200 hover:text-cyan-300"
      >
        Close ✕
      </button>

      {/* 3D Scene */}
      <Canvas
        camera={{ position: [0, 0, 520], fov: 60 }}
        shadows
        gl={{ antialias: true }}
      >
        {/* Background Stars */}
        <Stars
          radius={1200}
          depth={60}
          count={6000}
          factor={6}
          saturation={0}
          fade
        />

        {/* Lighting */}
        <ambientLight intensity={0.25} />

        <directionalLight
          position={[200, 150, 100]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <pointLight
          position={[-200, -100, -150]}
          intensity={0.6}
        />

        {/* Sun */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[45, 64, 64]} />
          <meshStandardMaterial
            emissive="#38bdf8"
            emissiveIntensity={1.4}
            roughness={0.6}
          />
        </mesh>

        {/* Planets */}
        <Planet orbit={140} radius={14} speed={0.9} color="#38bdf8" />
        <Planet orbit={220} radius={18} speed={0.6} color="#e879f9" />
        <Planet orbit={310} radius={16} speed={0.4} color="#facc15" />
        <Planet orbit={390} radius={20} speed={0.3} color="#f97316" />

        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.45}
          minDistance={200}
          maxDistance={900}
        />
      </Canvas>
    </div>
  );
}
