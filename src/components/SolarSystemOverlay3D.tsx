import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface Props {
  open: boolean;
  onClose: () => void;
}

/* ===================== STAR CLOUD ===================== */

function StarCloud() {
  const geometry = useMemo(() => {
    const count = 7000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2400;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="#f8fafc"
        size={1.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ===================== PLANET ===================== */

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
    if (!ref.current) return;
    angle.current += delta * speed;

    ref.current.position.set(
      Math.cos(angle.current) * orbit,
      0,
      Math.sin(angle.current) * orbit
    );
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius, 48, 48]} />
      <meshStandardMaterial
        color={color}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
}

/* ===================== 2D GRID ===================== */

function Grid2D() {
  return (
    <gridHelper
      args={[1200, 40, "#334155", "#1e293b"]}
      rotation={[0, 0, 0]}
      position={[0, -1, 0]}
    />
  );
}

/* ===================== MAIN OVERLAY ===================== */

export default function SolarSystemOverlay3D({
  open,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-6 z-20 px-3 py-1.5 text-sm bg-slate-900/90 border border-slate-600 rounded-full text-slate-200 hover:text-slate-300"
      >
        Close ✕
      </button>

      <Canvas
        camera={{ position: [0, 300, 700], fov: 55 }}
        gl={{ antialias: true }}
      >
        {/* Stars */}
        <Stars
          radius={2600}
          depth={120}
          count={5000}
          factor={6}
          saturation={0}
          fade
        />

        <StarCloud />

        {/* Lighting */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[500, 500, 300]} intensity={1.2} />
        <pointLight position={[-400, -300, -300]} intensity={0.6} />

        {/* 2D Grid */}
        <Grid2D />

        {/* Sun */}
        <mesh>
          <sphereGeometry args={[55, 64, 64]} />
          <meshStandardMaterial
            emissive="#fde68a"
            emissiveIntensity={1.5}
            roughness={0.6}
          />
        </mesh>

        {/* Planets */}
        <Planet orbit={220} radius={14} speed={0.45} color="#60a5fa" />
        <Planet orbit={300} radius={18} speed={0.35} color="#a78bfa" />
        <Planet orbit={390} radius={16} speed={0.28} color="#fca5a5" />
        <Planet orbit={480} radius={22} speed={0.22} color="#facc15" />

        {/* Controls (BUG FIX HERE) */}
        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.45}
          minDistance={250}   // ✅ prevents zooming into sun
          maxDistance={1000}  // ✅ prevents zooming too far (sun disappearing)
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
    </div>
  );
}
