import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, useGLTF } from "@react-three/drei";
import { useEffect, useRef , useMemo } from "react";
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

     group.current.position.y = 1.5;
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
/* ===================== GLOWING STARS ===================== */

function GlowingStars() {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const count = 6000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = -Math.random() * 2000;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    return geom;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    (
      pointsRef.current.material as THREE.PointsMaterial
    ).opacity = 0.75 + Math.sin(t * 0.4) * 0.1;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#e5faff"
        size={1.6}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
}

/* ===================== SCENE ===================== */

export default function ScrollShuttleBackground() {
  const scroll = useScrollProgress();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">

      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        gl={{ antialias: true }}
      >
        <GlowingStars />
        <fog attach="fog" args={["#000000", 400, 1600]} />



        <ambientLight intensity={0.4} />
        <directionalLight position={[6, 4, 5]} intensity={1.1} />

        <Shuttle scroll={scroll} />
      </Canvas>
    </div>
  );
}
