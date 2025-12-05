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

// Base planet definitions (world space)
const PLANETS = planetMeta.map((meta, i) => ({
  baseOrbit: 170 + i * 90,
  size: 16 + (i % 2) * 5,
  speedDegPerSec: 18 + i * 7, // degrees/sec
  baseAngleDeg: 45 + i * 63,
  wobbleAmp: 10 + i * 4,
  wobbleFreq: 0.25 + i * 0.1,
  color: ["#38bdf8", "#e879f9", "#a855f7", "#facc15", "#f97316"][i],
  meta,
}));

const SolarSystemOverlay = ({ open, onClose }: SolarSystemOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [zoom, setZoom] = useState(1);
  const [camera, setCamera] = useState({ x: 0, y: 0 });

  // Refs for animation loop
  const hoveredIndexRef = useRef<number | null>(null);
  const zoomRef = useRef(1);
  const cameraRef = useRef({ x: 0, y: 0 });
  const planetAnglesRef = useRef<number[]>(
    PLANETS.map((p) => (p.baseAngleDeg * Math.PI) / 180)
  );
  const planetPositionsRef = useRef<{ x: number; y: number; r: number }[]>([]);
  const lastTimeRef = useRef<number | null>(null);

  // drag state
  const draggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const camStartRef = useRef({ x: 0, y: 0 });

  // keep refs in sync with React state
  hoveredIndexRef.current = hoveredIndex;
  zoomRef.current = zoom;
  cameraRef.current = camera;

  useEffect(() => {
    if (!open) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const widthRef = { current: width };
    const heightRef = { current: height };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      widthRef.current = width;
      heightRef.current = height;
    };

    window.addEventListener("resize", resize);

    // World-space starfield for infinite feel
    type Star = { x: number; y: number; z: number; s: number };
    const stars: Star[] = [];
    const STAR_COUNT = 1200; // denser
    const STAR_RADIUS = 4000; // world units radius

    for (let i = 0; i < STAR_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * STAR_RADIUS;
      stars.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        z: Math.random(), // depth 0..1
        s: Math.random() * 0.8 + 0.2,
      });
    }

    const core = {
      baseRadius: 120,
      pulse: 0,
    };

    lastTimeRef.current = null;

    const orbitTilt = 0.42;

    const draw = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      const zoomLevel = zoomRef.current;
      const cam = cameraRef.current;

      const worldToScreen = (wx: number, wy: number) => {
        const sx = width / 2 + (wx - cam.x) * zoomLevel;
        const sy = height / 2 + (wy - cam.y) * zoomLevel;
        return { sx, sy };
      };

      // clear
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, width, height);

      // ---- STARFIELD ----
      const starDriftSpeed = 5; // world units per second (slow)
      for (const star of stars) {
        // very slow motion to feel infinite, not hyperspace
        star.y += starDriftSpeed * dt * (0.2 + star.z * 0.6);
        if (star.y > STAR_RADIUS) star.y = -STAR_RADIUS;

        const { sx, sy } = worldToScreen(star.x, star.y);
        const size = star.s * zoomLevel * (0.3 + star.z * 0.7);

        if (
          sx < -50 ||
          sy < -50 ||
          sx > width + 50 ||
          sy > height + 50
        ) {
          continue;
        }

        const alpha = 0.2 + (1 - star.z) * 0.6;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = "#e5e7eb";
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // ---- EQUINOX STAR ----
      core.pulse += dt * 1.5;
      const dynamicRadius =
        core.baseRadius * zoomLevel + Math.sin(core.pulse) * 10 * zoomLevel;

      const coreScreen = worldToScreen(0, 0);

      const glow = ctx.createRadialGradient(
        coreScreen.sx,
        coreScreen.sy,
        0,
        coreScreen.sx,
        coreScreen.sy,
        dynamicRadius * 2.8
      );
      glow.addColorStop(0, "rgba(56,189,248,0.85)");
      glow.addColorStop(0.4, "rgba(129,140,248,0.35)");
      glow.addColorStop(1, "rgba(15,23,42,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(coreScreen.sx, coreScreen.sy, dynamicRadius * 2.6, 0, Math.PI * 2);
      ctx.fill();

      const coreGrad = ctx.createRadialGradient(
        coreScreen.sx,
        coreScreen.sy,
        0,
        coreScreen.sx,
        coreScreen.sy,
        dynamicRadius
      );
      coreGrad.addColorStop(0, "#e0f2fe");
      coreGrad.addColorStop(0.45, "#38bdf8");
      coreGrad.addColorStop(1, "#0ea5e9");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(coreScreen.sx, coreScreen.sy, dynamicRadius, 0, Math.PI * 2);
      ctx.fill();

      // scalable core text
      const fontSize = Math.max(10, Math.min(32, 18 * zoomLevel));
      ctx.font = `bold ${fontSize}px system-ui, -apple-system, Inter, sans-serif`;
      ctx.fillStyle = "#020617";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("EQUINOX", coreScreen.sx, coreScreen.sy);

      // ---- PLANETS ----
      const angles = planetAnglesRef.current.slice();
      PLANETS.forEach((p, idx) => {
        if (hoveredIndexRef.current !== idx) {
          const inc = ((p.speedDegPerSec * dt) * Math.PI) / 180;
          angles[idx] += inc;
        }
      });
      planetAnglesRef.current = angles;

      const positions: { x: number; y: number; r: number }[] = [];

      PLANETS.forEach((p, idx) => {
        const angle = planetAnglesRef.current[idx];
        const isHovered = hoveredIndexRef.current === idx;
        const isSelected = selectedIndex === idx;

        const wobble =
          Math.sin(time * 0.001 * p.wobbleFreq + idx) * p.wobbleAmp;
        const orbit = (p.baseOrbit + wobble) * 1; // world units

        // draw orbit ellipse around world origin
        const orbitScreenRadius = orbit * zoomLevel;
        ctx.beginPath();
        ctx.ellipse(
          coreScreen.sx,
          coreScreen.sy,
          orbitScreenRadius,
          orbitScreenRadius * 0.35,
          0,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle =
          isHovered || isSelected
            ? "rgba(129,140,248,0.7)"
            : "rgba(148,163,184,0.22)";
        ctx.lineWidth = isSelected ? 1.8 : 1;
        ctx.stroke();

        // pseudo-3D position in world space
        const x3 = Math.cos(angle) * orbit;
        const z3 = Math.sin(angle) * orbit;
        const y3 = Math.sin(angle) * orbit * Math.sin(orbitTilt);

        const depth = (z3 / orbit + 1) / 2; // 0 back → 1 front
        const scaleDepth = 0.65 + depth * 0.7;
        const breathing =
          1 + Math.sin(time * 0.0015 + idx * 2.7) * 0.05;

        const baseRadius = p.size * scaleDepth * breathing;
        const radius = baseRadius * zoomLevel + (isHovered ? 3 : 0);

        const worldX = x3;
        const worldY = y3 * 0.7;
        const { sx, sy } = worldToScreen(worldX, worldY);

        // atmospheric glow
        ctx.beginPath();
        ctx.arc(sx, sy, radius + 6, 0, Math.PI * 2);
        ctx.fillStyle = p.color + "33";
        ctx.fill();

        // planet shading with terminator
        const shade = ctx.createRadialGradient(
          sx - radius / 3,
          sy - radius / 3,
          radius / 3,
          sx,
          sy,
          radius
        );
        shade.addColorStop(0, "#f9fafb");
        shade.addColorStop(0.4, p.color);
        shade.addColorStop(1, "#020617");
        ctx.fillStyle = shade;
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fill();

        // rings for some planets
        if (idx === 1 || idx === 3) {
          ctx.beginPath();
          ctx.ellipse(
            sx,
            sy,
            radius * 1.4,
            radius * 0.6,
            0.4,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = p.color + "55";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        if (isHovered) {
          ctx.font = "10px system-ui, sans-serif";
          ctx.fillStyle = "#e5e7eb";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText(p.meta.name, sx, sy - radius - 6);
        }

        positions.push({ x: sx, y: sy, r: radius });
      });

      planetPositionsRef.current = positions;

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose, selectedIndex]);

  // Interaction: hover, click, pan, zoom
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMove = (e: MouseEvent) => {
      if (draggingRef.current) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        const z = zoomRef.current || 1;
        const next = {
          x: camStartRef.current.x - dx / z,
          y: camStartRef.current.y - dy / z,
        };
        cameraRef.current = next;
        setCamera(next);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const positions = planetPositionsRef.current;
      let found: number | null = null;

      positions.forEach((p, idx) => {
        const dx = mx - p.x;
        const dy = my - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d <= p.r + 6) {
          found = idx;
        }
      });

      setHoveredIndex(found);
    };

    const handleDown = (e: MouseEvent) => {
      draggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      camStartRef.current = { ...cameraRef.current };
    };

    const handleUp = () => {
      draggingRef.current = false;
    };

    const handleClick = (e: MouseEvent) => {
      if (draggingRef.current) return;

      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const positions = planetPositionsRef.current;
      let clicked: number | null = null;

      positions.forEach((p, idx) => {
        const dx = mx - p.x;
        const dy = my - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d <= p.r + 6) {
          clicked = idx;
        }
      });

      if (clicked !== null) {
        setSelectedIndex(clicked);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((prev) => {
        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        const next = Math.min(3, Math.max(0.5, prev + delta));
        return next;
      });
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
  }, [open]);

  if (!open) return null;

  const activeIndex = hoveredIndex ?? selectedIndex ?? 0;
  const activePlanet =
    activeIndex !== null ? planetMeta[activeIndex] : planetMeta[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      <button
        onClick={onClose}
        className="absolute top-5 right-6 z-20 px-3 py-1.5 text-xs sm:text-sm bg-slate-900/80 border border-slate-600 rounded-full text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
      >
        Close ✕
      </button>

      <div className="absolute bottom-6 right-6 max-w-xs sm:max-w-sm z-20">
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/85 px-4 py-3 sm:px-5 sm:py-4 shadow-lg shadow-slate-900/80">
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">
            ORBITAL NODE
          </div>
          <div className="text-base sm:text-lg font-semibold text-slate-50 mb-1">
            {activePlanet.name}
          </div>
          <div className="text-xs sm:text-sm text-cyan-300 mb-1">
            {activePlanet.role}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-300">
            {activePlanet.detail}
          </p>
          <p className="text-[10px] text-slate-500 mt-3">
            Hover to freeze a planet. Scroll to zoom. Click &amp; drag to pan
            around the system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SolarSystemOverlay;
