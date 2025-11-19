import React, { useRef, useEffect, useState } from 'react';

const SYMBOLS = [
  // SVG path data for tech symbols/logos (simple forms)
  'M50,10 L90,90 L10,90 Z', // triangle (e.g. play button)
  'M50,10 A40,40 0 1,1 49.9,10', // circle (e.g. power)
  'M20,80 L50,20 L80,80', // up arrow (e.g. upload)
  'M20,50 L80,50', // horizontal line (e.g. minus)
  // Add more as needed
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase();
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  color: string;
  size: number;
  symbolIndex: number;
}

const COLORS = ['#00fff7', '#39ff14', '#fffb00', '#ff00cc', '#00ffea', '#ff6a00'];
const PARTICLE_COUNT = 90;

const ParticleSwarmBackground: React.FC<{ userName?: string }> = ({ userName = 'User' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [swarmPattern, setSwarmPattern] = useState(0); // 0: symbol, 1: initials, 2: random
  const [mouse, setMouse] = useState({ x: 400, y: 200, active: false });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [frameCount, setFrameCount] = useState(0);

  // Generate target points for a symbol or initials
  function getTargetPoints(type: number): { x: number; y: number }[] {
    const points: { x: number; y: number }[] = [];
    if (type === 0) {
      // Symbol: sample points along SVG path (approximate)
      const symbol = SYMBOLS[frameCount % SYMBOLS.length];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const angle = (i / PARTICLE_COUNT) * 2 * Math.PI;
        points.push({
          x: 400 + Math.cos(angle) * 120 + Math.sin(angle * 3) * 18,
          y: 200 + Math.sin(angle) * 120 + Math.cos(angle * 2) * 18,
        });
      }
    } else if (type === 1) {
      // Initials: form two big letters (approximate with points)
      const initials = getInitials(userName);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const t = i / PARTICLE_COUNT;
        const x = 400 + Math.sin(t * Math.PI * 2) * 110 + (initials.charCodeAt(0) % 2 ? 40 : -40);
        const y = 200 + Math.cos(t * Math.PI * 2) * 60;
        points.push({ x, y });
      }
    } else {
      // Random cloud
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        points.push({
          x: 400 + Math.random() * 320 - 160,
          y: 200 + Math.random() * 180 - 90,
        });
      }
    }
    return points;
  }

  // Initialize particles
  useEffect(() => {
    setParticles(
      Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
        x: 400 + Math.random() * 320 - 160,
        y: 200 + Math.random() * 180 - 90,
        vx: 0,
        vy: 0,
        tx: 400,
        ty: 200,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 3,
        symbolIndex: i % SYMBOLS.length,
      }))
    );
     
  }, []);

  // Swarm "learning" and pattern change
  useEffect(() => {
    const interval = setInterval(() => {
      setSwarmPattern(p => (p + 1) % 3);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  // Animation loop
  useEffect(() => {
    let frame: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;

    function animate() {
      setFrameCount(f => f + 1);
      ctx.clearRect(0, 0, width, height);
      const targets = getTargetPoints(swarmPattern);
      setParticles(prev =>
        prev.map((p, i) => {
          // Swarm AI: move toward target, with some inertia
          let tx = targets[i].x;
          let ty = targets[i].y;
          // Mouse repulsion
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const repel = mouse.active && dist < 120 ? (120 - dist) / 120 : 0;
          if (repel > 0) {
            tx += dx * repel * 1.5;
            ty += dy * repel * 1.5;
          }
          // Update velocity
          p.vx = lerp(p.vx, (tx - p.x) * 0.08, 0.2);
          p.vy = lerp(p.vy, (ty - p.y) * 0.08, 0.2);
          // Move
          p.x += p.vx;
          p.y += p.vy;
          // Draw
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 16;
          ctx.globalAlpha = 0.85;
          ctx.fill();
          ctx.restore();
          return p;
        })
      );
      // Draw lines between close particles (swarm effect)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const d = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
          if (d < 38) {
            ctx.save();
            ctx.strokeStyle = a.color;
            ctx.globalAlpha = 0.18;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
      frame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line
  }, [swarmPattern, mouse.x, mouse.y]);

  // Mouse/touch events
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      let x = 400, y = 200;
      if ('touches' in e && e.touches.length) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else if ('clientX' in e) {
        x = e.clientX;
        y = e.clientY;
      }
      setMouse(m => ({ ...m, x, y, active: true }));
    };
    const handleLeave = () => setMouse(m => ({ ...m, active: false }));
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseleave', handleLeave);
    window.addEventListener('touchend', handleLeave);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('touchend', handleLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90 pointer-events-auto"
      style={{ zIndex: 1 }}
    />
  );
};

export default ParticleSwarmBackground;
