import React, { useEffect, useRef, useState } from 'react';

const CODE_SNIPPETS = [
  'const x = 42;',
  'function greet() { return "Hi!"; }',
  'let data = fetch("/api/data");',
  'if (user.isActive) {...}',
  'console.log("Holo Stream!");',
  'for (let i=0; i<10; i++) {...}',
  '<div className="hologram" />',
  'export default function App() {...}',
  'useEffect(() => {...}, [])',
  'return <Hologram />;',
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

const STREAM_COUNT = 7;

const HoloDataStreams: React.FC = () => {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [bursts, setBursts] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse movement for stream bending
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMouse({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // Data bursts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.25) {
        setBursts((b) => [
          ...b,
          {
            id: Math.random(),
            x: randomBetween(0.1, 0.9),
            y: randomBetween(0.1, 0.9),
            code: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
          },
        ]);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Remove bursts after animation
  useEffect(() => {
    if (!bursts.length) return;
    const timeout = setTimeout(() => {
      setBursts((b) => b.slice(1));
    }, 1800);
    return () => clearTimeout(timeout);
  }, [bursts]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
      {/* Holographic Data Streams */}
      {[...Array(STREAM_COUNT)].map((_, i) => {
        // Streams are vertical or diagonal, bend with mouse
        const angle = randomBetween(-20, 20) + (mouse.x - 0.5) * 40;
        const left = `${(i + 1) * (100 / (STREAM_COUNT + 1))}%`;
        const gradient =
          'linear-gradient(180deg, rgba(0,255,255,0.18) 0%, rgba(0,255,255,0.08) 60%, transparent 100%)';
        return (
          <div
            key={i}
            className="absolute top-0 h-full w-1.5"
            style={{
              left,
              transform: `skewX(${angle}deg)`,
              background: gradient,
              filter: 'blur(1.5px) brightness(1.2)',
              boxShadow: '0 0 18px 2px #00fff7, 0 0 2px 0px #fff',
              opacity: 0.7,
              zIndex: 1,
            }}
          >
            {/* Flicker/scanline effect */}
            <div className="absolute inset-0 animate-holo-flicker" style={{ background: 'repeating-linear-gradient(transparent 0 6px, rgba(0,255,255,0.08) 7px 8px)' }} />
            {/* Floating code snippets */}
            {Math.random() < 0.5 && (
              <div
                className="absolute left-1/2 -translate-x-1/2 top-1/3 text-xs text-cyan-200 font-mono opacity-80 animate-holo-float"
                style={{
                  filter: 'drop-shadow(0 0 6px #00fff7)',
                  whiteSpace: 'nowrap',
                }}
              >
                {CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)]}
              </div>
            )}
          </div>
        );
      })}
      {/* Data bursts (hologram popups) */}
      {bursts.map((b) => (
        <div
          key={b.id}
          className="absolute"
          style={{
            left: `${b.x * 100}%`,
            top: `${b.y * 100}%`,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <div className="bg-cyan-200 bg-opacity-80 border border-cyan-400 rounded-xl px-4 py-2 text-xs font-mono text-cyan-900 shadow-xl animate-holo-burst">
            <span className="block text-cyan-700 font-bold mb-1">DATA BURST</span>
            <span>{b.code}</span>
          </div>
        </div>
      ))}
      {/* Holographic scanline overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(transparent 0 8px, rgba(0,255,255,0.04) 9px 10px)' }} />
    </div>
  );
};

export default HoloDataStreams;
