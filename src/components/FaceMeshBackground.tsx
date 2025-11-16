import React, { useRef, useEffect } from 'react';

// Simple animated AI face mesh using canvas (placeholder for advanced effect)
const FACE_POINTS = [
  { x: 160, y: 60 }, { x: 200, y: 50 }, { x: 240, y: 60 }, // brow
  { x: 180, y: 100 }, { x: 220, y: 100 }, // eyes
  { x: 200, y: 140 }, // nose
  { x: 180, y: 180 }, { x: 220, y: 180 }, // mouth corners
  { x: 200, y: 200 }, // chin
];

const MESH_EDGES = [
  [0, 1], [1, 2], // brow
  [0, 3], [1, 3], [1, 4], [2, 4], // to eyes
  [3, 5], [4, 5], // eyes to nose
  [5, 6], [5, 7], // nose to mouth
  [6, 7], [6, 8], [7, 8], // mouth to chin
];

const FaceMeshBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef(FACE_POINTS.map(p => ({ ...p })));
  const blinkRef = useRef(false);

  useEffect(() => {
    let frame: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let t = 0;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Animate points (subtle movement)
      pointsRef.current.forEach((pt, i) => {
        pt.x = FACE_POINTS[i].x + Math.sin(t / 20 + i) * 2;
        pt.y = FACE_POINTS[i].y + Math.cos(t / 25 + i) * 2;
      });
      // Blink (close eyes)
      if (blinkRef.current && t % 60 < 10) {
        pointsRef.current[3].y += 8; // left eye
        pointsRef.current[4].y += 8; // right eye
      }
      // Draw mesh
      ctx.strokeStyle = '#00fff7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      MESH_EDGES.forEach(([a, b]) => {
        ctx.moveTo(pointsRef.current[a].x, pointsRef.current[a].y);
        ctx.lineTo(pointsRef.current[b].x, pointsRef.current[b].y);
      });
      ctx.stroke();
      // Draw points
      pointsRef.current.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#39ff14';
        ctx.fill();
      });
      t++;
      frame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  // Simulate blink on click
  useEffect(() => {
    const blink = () => {
      blinkRef.current = true;
      setTimeout(() => (blinkRef.current = false), 300);
    };
    window.addEventListener('click', blink);
    return () => window.removeEventListener('click', blink);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={260}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default FaceMeshBackground;
