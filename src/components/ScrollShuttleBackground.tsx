import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ===================== SCROLL HOOK ===================== */

function useScrollProgress() {
  const progress = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const max =
        document.body.scrollHeight - window.innerHeight;
      progress.current = max > 0 ? window.scrollY / max : 0;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

/* ===================== SHUTTLE ===================== */

function Shuttle({ scroll }: { scroll: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);

  // TEMP PLACEHOLDER – later replace with GLTF
  useFrame(() => {
    if (!group.current) return;

    const p = scroll.current;

    // camera-style cinematic motion
    group.current.rotation.y = p * Math.PI * 0.6;
    group.current.position.z = -p * 6;
  });

  return (
    <group ref={group}>
      {/* BODY */}
      <mesh>
        <boxGeometry args={[2.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>

      {/* WINGS */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[4.5, 0.1, 1.2]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>

      {/* ENGINE */}
      <mesh position={[0, 0, -0.6]}>
        <cylinderGeometry args={[0.2, 0.3, 0.6, 16]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
    </group>
  );
}

/* ===================== SCENE ===================== */

export default function ScrollShuttleBackground() {
  const scroll = useScrollProgress();

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        gl={{ antialias: true }}
      >
        <Stars radius={200} depth={60} count={3000} fade />

        <ambientLight intensity={0.4} />
        <directionalLight position={[6, 4, 5]} intensity={1.1} />

        <Shuttle scroll={scroll} />
      </Canvas>
    </div>
  );
}
