import React, { useRef, useEffect, useState } from 'react';

const CODE_BLOCKS = [
  'const secret = "...";',
  'if (user.isHacker) { hack(); }',
  'function decrypt() { /* ... */ }',
  'console.log("Matrix online");',
  'let glitch = true;',
  'for (let i=0;i<42;i++){...}',
  '/* SYSTEM OVERRIDE */',
  'ACCESS GRANTED',
  'EASTER EGG FOUND',
  'function systemHack() { return "hacked!"; }',
];

const EASTER_EGGS = [
  'You found the rabbit hole!',
  'Wake up, Neo.',
  'Follow the white rabbit.',
  'There is no spoon.',
  '01101100 01101111 01101100',
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

const GlitchMatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [glitch, setGlitch] = useState(false);
  const [easterEgg, setEasterEgg] = useState<string | null>(null);
  const [blocks, setBlocks] = useState(
    Array.from({ length: 18 }).map((_, i) => ({
      x: randomBetween(60, 740),
      y: randomBetween(40, 360),
      w: randomBetween(80, 180),
      h: randomBetween(28, 44),
      code: CODE_BLOCKS[i % CODE_BLOCKS.length],
      glitch: false,
      decrypt: false,
    }))
  );

  // Glitch event
  useEffect(() => {
    let glitchTimeout: NodeJS.Timeout;
    let glitchInterval = setInterval(() => {
      setGlitch(true);
      glitchTimeout = setTimeout(() => setGlitch(false), randomBetween(180, 400));
    }, randomBetween(1800, 3200));
    return () => {
      clearInterval(glitchInterval);
      clearTimeout(glitchTimeout);
    };
  }, []);

  // Decrypt event
  useEffect(() => {
    let decryptTimeout: NodeJS.Timeout;
    let decryptInterval = setInterval(() => {
      setBlocks(blocks =>
        blocks.map(b =>
          Math.random() < 0.08
            ? { ...b, decrypt: true, code: EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)] }
            : { ...b, decrypt: false }
        )
      );
      decryptTimeout = setTimeout(() => {
        setBlocks(blocks =>
          blocks.map((b, i) => ({
            ...b,
            code: CODE_BLOCKS[i % CODE_BLOCKS.length],
            decrypt: false,
          }))
        );
      }, 1200);
    }, 7000);
    return () => {
      clearInterval(decryptInterval);
      clearTimeout(decryptTimeout);
    };
  }, []);

  // System hack animation
  const triggerSystemHack = () => {
    setGlitch(true);
    setEasterEgg(EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)]);
    setTimeout(() => setGlitch(false), 900);
    setTimeout(() => setEasterEgg(null), 2200);
    // Optionally play sound here
  };

  // Animation loop
  useEffect(() => {
    let frame: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;

    function drawScanlines() {
      ctx.save();
      ctx.globalAlpha = 0.13;
      for (let y = 0; y < height; y += 4) {
        ctx.fillStyle = '#00fff7';
        ctx.fillRect(0, y, width, 2);
      }
      ctx.restore();
    }

    function drawGlitchBlock(b: any) {
      ctx.save();
      ctx.globalAlpha = glitch ? randomBetween(0.5, 1) : 0.92;
      ctx.shadowColor = glitch ? '#fff' : '#00fff7';
      ctx.shadowBlur = glitch ? 24 : 12;
      ctx.fillStyle = b.decrypt ? '#f59e42' : '#0f172a';
      ctx.strokeStyle = glitch ? '#fff' : '#00fff7';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.rect(b.x + (glitch ? randomBetween(-8, 8) : 0), b.y + (glitch ? randomBetween(-8, 8) : 0), b.w, b.h);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = b.decrypt ? '#fff' : '#00fff7';
      ctx.globalAlpha = 1;
      ctx.fillText(b.code, b.x + 12, b.y + b.h / 1.6);
      ctx.restore();
    }

    function drawEasterEgg() {
      if (!easterEgg) return;
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#f59e42';
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 32;
      ctx.fillText(easterEgg, width / 2 - ctx.measureText(easterEgg).width / 2, height / 2);
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      // Glitch scanlines
      drawScanlines();
      // Code blocks
      blocks.forEach(drawGlitchBlock);
      // Easter egg
      drawEasterEgg();
      // Glitch overlay
      if (glitch) {
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 8; i++) {
          ctx.fillRect(randomBetween(0, width), randomBetween(0, height), randomBetween(40, 120), randomBetween(2, 8));
        }
        ctx.restore();
      }
      frame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, [blocks, glitch, easterEgg]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute w-full h-full top-0 left-0 opacity-60 pointer-events-none select-none"
        style={{ zIndex: 0 }}
        onDoubleClick={triggerSystemHack}
        title="Double-click to trigger system hack!"
      />
      {/* System hack button for accessibility */}
      <button
        onClick={triggerSystemHack}
        className="absolute top-4 right-4 z-10 bg-black/70 text-amber-400 px-4 py-2 rounded-lg text-xs shadow-lg hover:bg-amber-400 hover:text-black transition"
        style={{ pointerEvents: 'auto' }}
      >
        System Hack
      </button>
    </>
  );
};

export default GlitchMatrixBackground;
