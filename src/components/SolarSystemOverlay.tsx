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
  color: ["#38bdf8", "#e879f9", "#a855f7", "#facc15", "#f97316"][i],
  meta,
}));

const SolarSystemOverlay = ({ open, onClose }: SolarSystemOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [zoom, setZoom] = useState(1);
  const [viewRotation, setViewRotation] = useState(0); // like rotating globe

  // refs for animation loop
  const hoveredIndexRef = useRef<number | null>(null);
  const zoomRef = useRef(1);
  const viewRotationRef = useRef(0);
  const planetAnglesRef = useRef<number[]>(
    PLANETS.map((p) => (p.baseAngleDeg * Math.PI) / 180)
  );
  const planetPositionsRef = useRef<{ x: number; y: number; r: number }[]>([]);
  const lastTimeRef = useRef<number | null>(null);

  // drag state (to rotate view)
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const viewRotationStartRef = useRef(0);

  hoveredIndexRef.current = hoveredIndex;
  zoomRef.current = zoom;
  viewRotationRef.current = viewRotation;

  useEffect(() => {
    if (!open) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    // screen-space stars (constant size regardless of zoom)
    type Star = { x: number; y: number; tw: number };
    const stars: Star[] = [];
    const STAR_COUNT = 900;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        tw: Math.random() * Math.PI * 2,
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
      const viewRot = viewRotationRef.current;

      const centerX = width / 2;
      const centerY = height / 2;

      // clear
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, width, height);

      // ---- STARS: dense, slow, constant size ----
      for (const star of stars) {
        star.tw += dt * 0.3; // twinkling phase
        const alpha = 0.3 + 0.4 * Math.abs(Math.sin(star.tw));
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "#e5e7eb";
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // ---- EQUINOX STAR (center fixed) ----
      core.pulse += dt * 1.5;
      const dynamicRadius =
        core.baseRadius * zoomLevel + Math.sin(core.pulse) * 10 * zoomLevel;

      const glow = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        dynamicRadius * 2.8
      );
      glow.addColorStop(0, "rgba(56,189,248,0.85)");
      glow.addColorStop(0.4, "rgba(129,140,248,0.35)");
      glow.addColorStop(1, "rgba(15,23,42,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, dynamicRadius * 2.6, 0, Math.PI * 2);
      ctx.fill();

      const coreGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        dynamicRadius
      );
      coreGrad.addColorStop(0, "#e0f2fe");
      coreGrad.addColorStop(0.45, "#38bdf8");
      coreGrad.addColorStop(1, "#0ea5e9");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, dynamicRadius, 0, Math.PI * 2);
      ctx.fill();

      // text scales with zoom
      const fontSize = Math.max(10, Math.min(32, 18 * zoomLevel));
      ctx.font = `bold ${fontSize}px system-ui, -apple-system, Inter, sans-serif`;
      ctx.fillStyle = "#020617";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("EQUINOX", centerX, centerY);

      // ---- UPDATE PLANET ANGLES (freeze only hovered) ----
      const angles = planetAnglesRef.current.slice();
      PLANETS.forEach((p, idx) => {
        if (hoveredIndexRef.current === idx) return;
        const inc = ((p.speedDegPerSec * dt) * Math.PI) / 180;
        angles[idx] += inc;
      });
      planetAnglesRef.current = angles;

      const backPlanets: {
        screenX: number;
        screenY: number;
        radius: number;
        idx: number;
      }[] = [];
      const frontPlanets: {
        screenX: number;
        screenY: number;
        radius: number;
        idx: number;
      }[] = [];

      // precompute positions + depth
      const positionsForHit: { x: number; y: number; r: number }[] = [];

      PLANETS.forEach((p, idx) => {
        const rawAngle = planetAnglesRef.current[idx] + viewRot; // rotate view
        const isHovered = hoveredIndexRef.current === idx;
        const isSelected = selectedIndex === idx;

        const wobble =
          Math.sin(time * 0.001 * p.wobbleFreq + idx) * p.wobbleAmp;
        const orbit = (p.baseOrbit + wobble) * 1; // world units

        // orbit path in screen space (ellipse)
        const orbitScreenRadius = orbit * zoomLevel;
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
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

        // pseudo-3D world position
        const x3 = Math.cos(rawAngle) * orbit;
        const z3 = Math.sin(rawAngle) * orbit;
        const y3 = Math.sin(rawAngle) * orbit * Math.sin(orbitTilt);

        const depth = (z3 / orbit + 1) / 2; // 0 back -> 1 front
        const depthScale = 0.65 + depth * 0.7;
        const breathing =
          1 + Math.sin(time * 0.0015 + idx * 2.7) * 0.05;

        const baseRadius = p.size * depthScale * breathing;
        const radius = baseRadius * zoomLevel + (isHovered ? 3 : 0);

        const screenX = centerX + x3 * zoomLevel;
        const screenY = centerY + y3 * 0.7 * zoomLevel;

        positionsForHit.push({ x: screenX, y: screenY, r: radius });

        const bucket = z3 < 0 ? backPlanets : frontPlanets;
        bucket.push({ screenX, screenY, radius, idx });
      });

      planetPositionsRef.current = positionsForHit;

      // ---- DRAW BACK PLANETS (behind the sun) ----
      backPlanets.forEach(({ screenX, screenY, radius, idx }) => {
        const p = PLANETS[idx];
        const isHovered = hoveredIndexRef.current === idx;

        // glow
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius + 6, 0, Math.PI * 2);
        ctx.fillStyle = p.color + "33";
        ctx.fill();

        const shade = ctx.createRadialGradient(
          screenX - radius / 3,
          screenY - radius / 3,
          radius / 3,
          screenX,
          screenY,
          radius
        );
        shade.addColorStop(0, "#f9fafb");
        shade.addColorStop(0.4, p.color);
        shade.addColorStop(1, "#020617");
        ctx.fillStyle = shade;
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        ctx.fill();

        if (idx === 1 || idx === 3) {
          ctx.beginPath();
          ctx.ellipse(
            screenX,
            screenY,
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
          ctx.fillText(p.meta.name, screenX, screenY - radius - 6);
        }
      });

      // ---- SUN IS ALREADY DRAWN HERE (acts as occluder) ----
      // (we drew it earlier; that's fine – planets behind are under it)

      // ---- DRAW FRONT PLANETS (in front of sun) ----
      frontPlanets.forEach(({ screenX, screenY, radius, idx }) => {
        const p = PLANETS[idx];
        const isHovered = hoveredIndexRef.current === idx;

        ctx.beginPath();
        ctx.arc(screenX, screenY, radius + 6, 0, Math.PI * 2);
        ctx.fillStyle = p.color + "33";
        ctx.fill();

        const shade = ctx.createRadialGradient(
          screenX - radius / 3,
          screenY - radius / 3,
          radius / 3,
          screenX,
          screenY,
          radius
        );
        shade.addColorStop(0, "#f9fafb");
        shade.addColorStop(0.4, p.color);
        shade.addColorStop(1, "#020617");
        ctx.fillStyle = shade;
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        ctx.fill();

        if (idx === 1 || idx === 3) {
          ctx.beginPath();
          ctx.ellipse(
            screenX,
            screenY,
            radius * 1.4,
            radius * 0.6,
            0.4,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = p.color + "88";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        if (isHovered) {
          ctx.font = "10px system-ui, sans-serif";
          ctx.fillStyle = "#e5e7eb";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText(p.meta.name, screenX, screenY - radius - 6);
        }
      });

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

  // interactions: hover, click, rotate view, zoom
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMove = (e: MouseEvent) => {
      if (draggingRef.current) {
        const dx = e.clientX - dragStartXRef.current;
        const rotationDelta = dx * 0.004; // drag sensitivity
        const next = viewRotationStartRef.current + rotationDelta;
        viewRotationRef.current = next;
        setViewRotation(next);
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
      dragStartXRef.current = e.clientX;
      viewRotationStartRef.current = viewRotationRef.current;
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
            Hover to freeze a planet. Scroll to zoom. Drag left/right to rotate
            the system (like Google Earth around a star).
          </p>
        </div>
      </div>
    </div>
  );
};

export default SolarSystemOverlay;
