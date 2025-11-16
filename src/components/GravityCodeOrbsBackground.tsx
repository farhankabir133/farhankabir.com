import React, { useRef, useEffect, useState } from 'react';

// Example code snippets for orbs
const CODE_SNIPPETS = [
  `function greet(name) {\n  return 'Hello, ' + name;\n}`,
  `const sum = (a, b) => a + b;`,
  `for (let i = 0; i < 10; i++) {\n  console.log(i);\n}`,
  `const user = { name: 'AI', role: 'assistant' };`,
  `if (active) {\n  doWork();\n}`,
  `class Orb {\n  constructor() {\n    this.energy = 100;\n  }\n}`
];


function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Move Orb interface to top-level
interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  code: string;
  open: boolean;
  color: string;
  shape: 'circle' | 'hex' | 'cube';
  dragging?: boolean;
  dragOffsetX?: number;
  dragOffsetY?: number;
  hovered?: boolean;
  lastInteracted?: number; // timestamp for last interaction
}

const COLORS = ['#00fff7', '#39ff14', '#fffb00', '#ff00cc', '#00ffea', '#ff6a00'];


const GravityCodeOrbsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const [dragged, setDragged] = useState<number | null>(null);
  const [mouse, setMouse] = useState({ x: 400, y: 200, down: false });
  const [ui, setUI] = useState({ color: COLORS[0], shape: 'circle' as 'circle' | 'hex' | 'cube', code: CODE_SNIPPETS[0] });
  const [speed, setSpeed] = useState(1.0); // Orb speed multiplier

  // Keyboard shortcuts for speed
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') setSpeed(s => Math.min(3, Math.round((s + 0.1) * 10) / 10));
      if (e.key === '-' || e.key === '_') setSpeed(s => Math.max(0.2, Math.round((s - 0.1) * 10) / 10));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Initialize orbs
  useEffect(() => {
    const initialOrbs: Orb[] = Array.from({ length: 6 }).map((_, i) => ({
      x: randomBetween(100, 700),
      y: randomBetween(80, 300),
      vx: randomBetween(-0.5, 0.5),
      vy: randomBetween(-0.5, 0.5),
      r: randomBetween(48, 70),
      code: CODE_SNIPPETS[i % CODE_SNIPPETS.length],
      open: false,
      color: COLORS[i % COLORS.length],
      shape: ['circle', 'hex', 'cube'][i % 3] as 'circle' | 'hex' | 'cube',
    }));
    setOrbs(initialOrbs);
  }, []);

  // Animation loop with speed variation and user speed control
  useEffect(() => {
    let frame: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;

    function drawCodeInOrb(orb: Orb) {
      ctx.save();
      ctx.beginPath();
      // Morph shape
      if (orb.shape === 'circle') {
        ctx.arc(orb.x, orb.y, orb.r - 8, 0, 2 * Math.PI);
      } else if (orb.shape === 'hex') {
        for (let i = 0; i < 6; i++) {
          const angle = Math.PI / 3 * i;
          const px = orb.x + (orb.r - 8) * Math.cos(angle);
          const py = orb.y + (orb.r - 8) * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      } else if (orb.shape === 'cube') {
        ctx.rect(orb.x - orb.r + 8, orb.y - orb.r + 8, (orb.r - 8) * 2, (orb.r - 8) * 2);
      }
      ctx.clip();
      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = '#fff';
      const lines = orb.code.split('\n');
      lines.forEach((line, i) => {
        ctx.fillText(line, orb.x - orb.r + 18, orb.y - 10 + i * 18);
      });
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      const now = Date.now();
      for (let i = 0; i < orbs.length; i++) {
        let orb = orbs[i];
        // --- Speed Variation Logic ---
        // 1. Accelerate if hovered, clicked, or dragged
        let speedBoost = 1;
        if (orb.dragging) speedBoost = 2.5;
        else if (orb.hovered) speedBoost = 1.7;
        else if (orb.lastInteracted && now - orb.lastInteracted < 600) speedBoost = 2.2 - (now - orb.lastInteracted) / 1000;

        // 2. Orbs near mouse move faster/scatter
        const distToMouse = Math.sqrt((orb.x - mouse.x) ** 2 + (orb.y - mouse.y) ** 2);
        if (distToMouse < 120) {
          speedBoost += (120 - distToMouse) / 80; // up to +1.5x
          // Scatter: add a burst of velocity if very close
          if (distToMouse < 40 && !orb.dragging) {
            const angle = Math.atan2(orb.y - mouse.y, orb.x - mouse.x);
            orb.vx += Math.cos(angle) * 0.7 * Math.random();
            orb.vy += Math.sin(angle) * 0.7 * Math.random();
          }
        }

        // --- User speed multiplier ---
        speedBoost *= speed;

        // AI clustering: orbs cluster around mouse if mouse is moving or down
        const clusterStrength = mouse.down ? 0.12 : 0.04;
        const dxm = mouse.x - orb.x;
        const dym = mouse.y - orb.y;
        orb.vx += dxm * clusterStrength / 200 * speedBoost;
        orb.vy += dym * clusterStrength / 200 * speedBoost;

        // Gravity and bounce
        if (!orb.dragging) {
          orb.vy += 0.01 * speedBoost;
          orb.x += orb.vx * speedBoost;
          orb.y += orb.vy * speedBoost;
          // Gradually slow down (friction)
          orb.vx *= 0.98;
          orb.vy *= 0.98;
        }

        // Wall collision
        if (orb.x - orb.r < 0 || orb.x + orb.r > width) orb.vx *= -1;
        if (orb.y - orb.r < 0 || orb.y + orb.r > height) orb.vy *= -0.9;
        orb.x = Math.max(orb.r, Math.min(width - orb.r, orb.x));
        orb.y = Math.max(orb.r, Math.min(height - orb.r, orb.y));

        // Orb collision
        for (let j = i + 1; j < orbs.length; j++) {
          let other = orbs[j];
          let dx = orb.x - other.x;
          let dy = orb.y - other.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < orb.r + other.r) {
            // Simple elastic collision
            let angle = Math.atan2(dy, dx);
            let targetX = other.x + Math.cos(angle) * (orb.r + other.r);
            let targetY = other.y + Math.sin(angle) * (orb.r + other.r);
            let ax = (targetX - orb.x) * 0.05;
            let ay = (targetY - orb.y) * 0.05;
            orb.vx -= ax;
            orb.vy -= ay;
            other.vx += ax;
            other.vy += ay;
          }
        }

        // Draw orb (morph shape)
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        if (orb.shape === 'circle') {
          ctx.arc(orb.x, orb.y, orb.r, 0, 2 * Math.PI);
        } else if (orb.shape === 'hex') {
          for (let k = 0; k < 6; k++) {
            const angle = Math.PI / 3 * k;
            const px = orb.x + orb.r * Math.cos(angle);
            const py = orb.y + orb.r * Math.sin(angle);
            if (k === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
        } else if (orb.shape === 'cube') {
          ctx.rect(orb.x - orb.r, orb.y - orb.r, orb.r * 2, orb.r * 2);
        }
        ctx.fillStyle = orb.color;
        ctx.shadowColor = orb.color;
        ctx.shadowBlur = 24;
        ctx.fill();
        ctx.restore();
        // Swirling code
        drawCodeInOrb(orb);
        // If open, draw overlay
        if (orb.open) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, orb.r + 10, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(0,0,0,0.85)';
          ctx.fill();
          ctx.font = 'bold 16px monospace';
          ctx.fillStyle = '#fff';
          ctx.fillText('Project Details:', orb.x - orb.r + 20, orb.y - orb.r);
          ctx.fillText(orb.code, orb.x - orb.r + 20, orb.y - orb.r + 20);
          ctx.restore();
        }
      }
      frame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, [orbs, mouse, speed]);

  // Mouse and drag/hover/click events for speed variation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let dragging = false;
    let dragIndex: number | null = null;
    let lastX = 0, lastY = 0;

    const handleDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMouse(m => ({ ...m, down: true, x, y }));
      setOrbs(orbs => orbs.map((o) => ({ ...o, hovered: false })));
      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];
        const dist = Math.sqrt((orb.x - x) ** 2 + (orb.y - y) ** 2);
        if (dist < orb.r) {
          dragging = true;
          dragIndex = i;
          lastX = x;
          lastY = y;
          setOrbs(orbs => orbs.map((o, idx) => idx === i ? { ...o, dragging: true, dragOffsetX: x - o.x, dragOffsetY: y - o.y, lastInteracted: Date.now() } : o));
          break;
        }
      }
    };
    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMouse(m => ({ ...m, x, y }));
      setOrbs(orbs => orbs.map((o) => {
        const dist = Math.sqrt((o.x - x) ** 2 + (o.y - y) ** 2);
        return { ...o, hovered: dist < o.r };
      }));
      if (dragging && dragIndex !== null) {
        setOrbs(orbs => orbs.map((o, idx) => idx === dragIndex && o.dragging ? { ...o, x: x - (o.dragOffsetX || 0), y: y - (o.dragOffsetY || 0) } : o));
      }
    };
    const handleUp = (e: MouseEvent) => {
      setMouse(m => ({ ...m, down: false }));
      if (dragging && dragIndex !== null) {
        // Flick: set velocity based on last movement
        setOrbs(orbs => orbs.map((o, idx) => idx === dragIndex && o.dragging ? { ...o, vx: (mouse.x - lastX) * 0.2, vy: (mouse.y - lastY) * 0.2, dragging: false, lastInteracted: Date.now() } : { ...o, dragging: false }));
        // Ripple: push other orbs away
        setOrbs(orbs => orbs.map((o, idx) => {
          if (idx !== dragIndex) {
            const dx = o.x - mouse.x;
            const dy = o.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
              return { ...o, vx: o.vx + dx / dist * 2, vy: o.vy + dy / dist * 2 };
            }
          }
          return o;
        }));
      }
      dragging = false;
      dragIndex = null;
      setOrbs(orbs => orbs.map((o) => ({ ...o, hovered: false })));
    };
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setOrbs(orbs =>
        orbs.map((orb, i) => {
          const dist = Math.sqrt((orb.x - x) ** 2 + (orb.y - y) ** 2);
          if (dist < orb.r) {
            return { ...orb, open: !orb.open, lastInteracted: Date.now() };
          }
          return orb;
        })
      );
    };
    canvas.addEventListener('mousedown', handleDown);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleUp);
    canvas.addEventListener('mouseleave', handleUp);
    canvas.addEventListener('click', handleClick);
    return () => {
      canvas.removeEventListener('mousedown', handleDown);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleUp);
      canvas.removeEventListener('mouseleave', handleUp);
      canvas.removeEventListener('click', handleClick);
    };
  }, [orbs, mouse.x, mouse.y]);

  // Simulate live code updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOrbs(orbs => orbs.map((orb, i) =>
        Math.random() < 0.2 ? { ...orb, code: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)] } : orb
      ));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // UI for color, code, shape
  const handleColor = (color: string) => {
    setOrbs(orbs => orbs.map((orb, i) => i === 0 ? { ...orb, color } : orb));
    setUI(ui => ({ ...ui, color }));
  };
  const handleShape = (shape: 'circle' | 'hex' | 'cube') => {
    setOrbs(orbs => orbs.map((orb, i) => i === 0 ? { ...orb, shape } : orb));
    setUI(ui => ({ ...ui, shape }));
  };
  const handleCode = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOrbs(orbs => orbs.map((orb, i) => i === 0 ? { ...orb, code: e.target.value } : orb));
    setUI(ui => ({ ...ui, code: e.target.value }));
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90 pointer-events-auto"
        style={{ zIndex: 1 }}
      />
      {/* Customization UI for first orb and speed */}
{/* Customization UI for first orb and speed */}
<div className="absolute top-4 left-4 rounded-xl p-3 md:p-4 z-20 flex flex-col gap-3 
  bg-white/70 text-gray-900 shadow-lg backdrop-blur-md 
  dark:bg-black/70 dark:text-white md:min-w-[240px]">

  <div className="font-bold mb-1 hidden md:block">Customize Main Orb</div>

  <div className="hidden md:flex gap-2 mb-2">
    {COLORS.map(c => (
      <button
        key={c}
        className="w-6 h-6 rounded-full border-2"
        style={{ background: c, borderColor: ui.color === c ? '#000' : 'transparent' }}
        onClick={() => handleColor(c)}
      />
    ))}
  </div>

  <div className="hidden md:flex gap-2 mb-2">
    {(['circle', 'hex', 'cube'] as const).map(shape => (
      <button
        key={shape}
        className={`px-2 py-1 rounded ${ui.shape === shape ? 'bg-amber-400 text-black' : 'bg-slate-200 dark:bg-slate-700'}`}
        onClick={() => handleShape(shape)}
      >
        {shape}
      </button>
    ))}
  </div>

  <textarea
    className="w-full bg-slate-100 dark:bg-slate-900 rounded p-2 text-xs text-gray-800 dark:text-white hidden md:block"
    rows={3}
    value={ui.code}
    onChange={handleCode}
  />

  <div className="flex flex-col gap-1">
    <label htmlFor="orb-speed-slider" className="text-xs font-semibold">
      Orb Speed: <span className="text-amber-500">{speed.toFixed(1)}x</span>
    </label>
    <input
      id="orb-speed-slider"
      type="range"
      min={0.2}
      max={3}
      step={0.1}
      value={speed}
      onChange={e => setSpeed(Number(e.target.value))}
      className="w-full accent-amber-500"
    />
    <div className="text-xs text-gray-600 dark:text-slate-400 hidden md:block">
      Use <kbd>+</kbd>/<kbd>-</kbd> to adjust speed
    </div>
  </div>
</div>
    </>
  );
};

export default GravityCodeOrbsBackground;