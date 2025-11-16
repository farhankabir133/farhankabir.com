import React, { useRef, useEffect } from 'react';

const PARTICLE_COUNT = 1200;
const COLORS = [
  'rgba(0,255,128,0.7)', // green
  'rgba(0,255,200,0.7)', // teal
  'rgba(120,255,255,0.5)', // light teal
  'rgba(80,255,80,0.5)', // soft green
  'rgba(180,255,220,0.4)', // grayish teal
  'rgba(180,220,200,0.3)', // gray
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  color: string;
  shimmer: number;
}

const FuturisticParticleMatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0, down: false });

  // Initialize particles
  useEffect(() => {
    const w = window.innerWidth;
    const h = 600;
    particles.current = Array.from({ length: PARTICLE_COUNT }).map(() => {
      const x = randomBetween(0, w);
      const y = randomBetween(0, h);
      const size = randomBetween(1.5, 3.5);
      const baseAlpha = randomBetween(0.18, 0.5);
      return {
        x,
        y,
        vx: randomBetween(-0.08, 0.08),
        vy: randomBetween(-0.08, 0.08),
        size,
        baseAlpha,
        alpha: baseAlpha,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shimmer: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let running = true;
    const w = window.innerWidth;
    const h = 600;
    canvas.width = w;
    canvas.height = h;

    function animate() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        // Shimmer and fade
        p.shimmer += 0.04 + Math.random() * 0.01;
        p.alpha = p.baseAlpha + Math.sin(p.shimmer) * 0.18 + Math.random() * 0.05;
        // Dynamic clustering/dispersal
        let fx = 0, fy = 0;
        for (let j = 0; j < particles.current.length; j++) {
          if (i === j) continue;
          const q = particles.current[j];
          const dx = q.x - p.x;
          const dy = q.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 32) {
            // Cluster: attract if close
            fx += dx * 0.0005;
            fy += dy * 0.0005;
          } else if (dist < 120) {
            // Disperse: repel if mid-range
            fx -= dx * 0.0001;
            fy -= dy * 0.0001;
          }
        }
        // Interactive: mouse effect
        const mdx = p.x - mouse.current.x;
        const mdy = p.y - mouse.current.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 100) {
          // Cluster or repel on mouse down
          if (mouse.current.down) {
            fx -= mdx * 0.01;
            fy -= mdy * 0.01;
            p.alpha = Math.min(1, p.alpha + 0.18);
          } else {
            fx += mdx * 0.008;
            fy += mdy * 0.008;
            p.alpha = Math.min(1, p.alpha + 0.08);
          }
        }
        // Update velocity and position
        p.vx += fx;
        p.vy += fy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        // Wrap around
        if (p.x < 0) p.x += w;
        if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h;
        if (p.y > h) p.y -= h;
        // Draw
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.restore();
      }
      if (running) requestAnimationFrame(animate);
    }
    animate();
    return () => { running = false; };
  }, []);

  // Mouse events
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    const handleDown = () => { mouse.current.down = true; };
    const handleUp = () => { mouse.current.down = false; };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: 600,
        zIndex: 1,
        pointerEvents: 'auto',
        background: 'black',
      }}
    />
  );
};

export default FuturisticParticleMatrixBackground;
