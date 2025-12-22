import { useEffect, useRef, useState } from "react";

interface SolarSystemOverlayProps {
  open: boolean;
  onClose: () => void;
}

interface PlanetMeta {
  name: string;
  role: string;
  detail: string;
}

const planetMeta: PlanetMeta[] = [
  {
    name: "Apogee Lab",
    role: "Rocketry & Flight",
    detail: "Model rockets, propulsion tests, and launch campaigns.",
  },
  {
    name: "Lagrange Hub",
    role: "Mission Design",
    detail: "Orbital mechanics, transfers, and mission architecture sims.",
  },
  {
    name: "Deep Space Array",
    role: "Astro-Observations",
    detail: "Night-sky sessions, telescopes, and astrophotography.",
  },
  {
    name: "Payload Bay",
    role: "Satellites & Instruments",
    detail: "Cubesat concepts, payload ideas, and onboard software.",
  },
  {
    name: "Signal Horizon",
    role: "Software & Control",
    detail: "Simulators, dashboards, and guidance/control prototypes.",
  },
];

const PLANETS = planetMeta.map((meta, i) => ({
  baseOrbit: 170 + i * 90,
  size: 16 + (i % 2) * 5,
  speedDegPerSec: 18 + i * 7,
  baseAngleDeg: 40 + i * 70,
  wobbleAmp: 10 + i * 4,
  wobbleFreq: 0.25 + i * 0.12,
  eccentricity: i % 2 === 0 ? 0.85 : 1,
  color: ["#38bdf8", "#e879f9", "#a855f7", "#facc15", "#f97316"][i],
  meta,
}));

const SolarSystemOverlay = ({ open, onClose }: SolarSystemOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [zoom, setZoom] = useState(1);

  const hoveredIndexRef = useRef<number | null>(null);
  const zoomRef = useRef(1);
  const viewRotationRef = useRef(0);
  const rotationVelocityRef = useRef(0);

  const planetAnglesRef = useRef<number[]>(
    PLANETS.map((p) => (p.baseAngleDeg * Math.PI) / 180)
  );
  const planetPositionsRef = useRef<{ x: number; y: number; r: number }[]>([]);
  const lastTimeRef = useRef<number | null>(null);

  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const viewRotationStartRef = useRef(0);

  hoveredIndexRef.current = hoveredIndex;
  zoomRef.current = zoom;

  useEffect(() => {
    if (!open) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 900 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random(),
      tw: Math.random() * Math.PI * 2,
    }));

    const core = { baseRadius: 120, pulse: 0 };
    const orbitTilt = 0.42;

    const drawPlanet = (
      x: number,
      y: number,
      r: number,
      color: string,
      hover: boolean
    ) => {
      ctx.beginPath();
      ctx.arc(x, y, r + 6, 0, Math.PI * 2);
      ctx.fillStyle = color + "33";
      ctx.fill();

      const grad = ctx.createRadialGradient(
        x - r / 3,
        y - r / 3,
        r / 3,
        x,
        y,
        r
      );
      grad.addColorStop(0, "#f9fafb");
      grad.addColorStop(0.4, color);
      grad.addColorStop(1, "#020617");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      if (hover) {
        ctx.font = "10px system-ui";
        ctx.fillStyle = "#e5e7eb";
        ctx.textAlign = "center";
        ctx.fillText(color, x, y - r - 8);
      }
    };

    const draw = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, width, height);

      stars.forEach((s) => {
        s.tw += dt * (0.8 + s.z);
        ctx.globalAlpha = 0.2 + Math.sin(s.tw * 6) * 0.3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "#f1f5f9";
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      if (!draggingRef.current) {
        rotationVelocityRef.current *= 0.95;
        viewRotationRef.current += rotationVelocityRef.current;
      }

      core.pulse += dt * 1.5;
      const cx = width / 2;
      const cy = height / 2;
      const r = core.baseRadius * zoomRef.current;

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = "#001119ff";
      ctx.fill();

      const positions: { x: number; y: number; r: number }[] = [];

      PLANETS.forEach((p, i) => {
        if (selectedIndex === i) {
          const target = Math.PI / 2;
          planetAnglesRef.current[i] +=
            (target - planetAnglesRef.current[i]) * 0.02;
        } else {
          planetAnglesRef.current[i] +=
            (p.speedDegPerSec * dt * Math.PI) / 180;
        }

        const angle = planetAnglesRef.current[i] + viewRotationRef.current;
        const orbit = p.baseOrbit + Math.sin(time * 0.001 + i) * p.wobbleAmp;

        const x3 = Math.cos(angle) * orbit * p.eccentricity;
        const z3 = Math.sin(angle) * orbit;
        const y3 = Math.sin(angle) * orbit * Math.sin(orbitTilt);

        const depth = (z3 / orbit + 1) / 2;
        const scale = 0.6 + depth * 0.8;

        const sx = cx + x3 * zoomRef.current;
        const sy = cy + y3 * 0.7 * zoomRef.current;
        const sr = p.size * scale * zoomRef.current;

        positions.push({ x: sx, y: sy, r: sr });
        drawPlanet(sx, sy, sr, p.color, hoveredIndexRef.current === i);
      });

      planetPositionsRef.current = positions;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current!);
      window.removeEventListener("resize", resize);
    };
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current!;

    const handleMove = (e: MouseEvent) => {
      if (draggingRef.current) {
        const dx = e.clientX - dragStartXRef.current;
        const delta = dx * 0.004;
        rotationVelocityRef.current = delta;
        viewRotationRef.current = viewRotationStartRef.current + delta;
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let found: number | null = null;
      planetPositionsRef.current.forEach((p, i) => {
        if (Math.hypot(mx - p.x, my - p.y) < p.r + 6) found = i;
      });

      canvas.style.cursor = found !== null ? "pointer" : "grab";
      setHoveredIndex(found);
    };

    const handleDown = (e: MouseEvent) => {
      draggingRef.current = true;
      dragStartXRef.current = e.clientX;
      viewRotationStartRef.current = viewRotationRef.current;
    };

    const handleUp = () => (draggingRef.current = false);

    const handleClick = () => {
      if (hoveredIndex !== null) {
        setSelectedIndex(hoveredIndex);
        // window.location.href = `/domains/${planetMeta[hoveredIndex].name}`;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) => Math.min(3, Math.max(0.6, z + (e.deltaY > 0 ? -0.12 : 0.12))));
    };

    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [open, hoveredIndex]);

  if (!open) return null;

  const active = planetMeta[hoveredIndex ?? selectedIndex ?? 0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      <button
        onClick={onClose}
        className="absolute top-5 right-6 z-20 px-3 py-1.5 text-xs bg-slate-900 border border-slate-600 rounded-full text-slate-200 hover:text-cyan-300"
      >
        Close ✕
      </button>

      <div className="absolute bottom-6 right-6 max-w-sm z-20">
        <div className="rounded-xl bg-slate-900/85 border border-slate-700 p-4">
          <div className="text-xs tracking-widest text-slate-400 mb-1">
            ORBITAL NODE
          </div>
          <div className="text-lg font-semibold text-slate-50">
            {active.name}
          </div>
          <div className="text-sm text-cyan-300">{active.role}</div>
          <p className="text-xs text-slate-300 mt-1">{active.detail}</p>
        </div>
      </div>
    </div>
  );
};

export default SolarSystemOverlay;
