import React, { useRef, useEffect, useCallback } from 'react';

interface MobileEventHorizonProps {
  speed?: number;
  starCount?: number;
}

interface Star {
  x: number;
  y: number;
  z: number;
  prevZ: number;
}

// Hyperspace warp speed effect - like flying through space at light speed
const MobileEventHorizon: React.FC<MobileEventHorizonProps> = ({
  speed = 0.02,
  starCount = 400,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>();
  const speedMultiplier = useRef(1);
  const targetSpeed = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize stars in 3D space
    const initStars = () => {
      starsRef.current = [];
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: (Math.random() - 0.5) * 2, // -1 to 1
          y: (Math.random() - 0.5) * 2, // -1 to 1
          z: Math.random(), // 0 to 1 (depth)
          prevZ: Math.random(),
        });
      }
    };
    initStars();

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxDimension = Math.max(canvas.width, canvas.height);

      // Smoothly interpolate speed
      speedMultiplier.current += (targetSpeed.current - speedMultiplier.current) * 0.05;

      // Draw background with slight fade for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw dark gradient overlay occasionally to prevent full white
      if (Math.random() < 0.1) {
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, maxDimension * 0.8
        );
        gradient.addColorStop(0, 'rgba(15, 23, 42, 0.1)');
        gradient.addColorStop(0.5, 'rgba(2, 6, 23, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Update and draw stars
      starsRef.current.forEach((star) => {
        // Store previous z for trail calculation
        star.prevZ = star.z;

        // Move star towards viewer (decrease z)
        star.z -= speed * speedMultiplier.current;

        // Reset star if it passes the viewer
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * 2;
          star.y = (Math.random() - 0.5) * 2;
          star.z = 1;
          star.prevZ = 1;
        }

        // Project 3D position to 2D screen
        const scale = 1 / star.z;
        const prevScale = 1 / star.prevZ;

        const screenX = centerX + star.x * scale * maxDimension * 0.5;
        const screenY = centerY + star.y * scale * maxDimension * 0.5;
        const prevScreenX = centerX + star.x * prevScale * maxDimension * 0.5;
        const prevScreenY = centerY + star.y * prevScale * maxDimension * 0.5;

        // Skip if off screen
        if (screenX < 0 || screenX > canvas.width || screenY < 0 || screenY > canvas.height) {
          return;
        }

        // Calculate star properties based on depth
        const brightness = Math.min(1, (1 - star.z) * 1.5);
        const size = Math.max(0.5, (1 - star.z) * 3);

        // Draw star trail (the warp streak)
        const trailLength = Math.sqrt(
          Math.pow(screenX - prevScreenX, 2) + Math.pow(screenY - prevScreenY, 2)
        );

        if (trailLength > 1 && speedMultiplier.current > 0.3) {
          // Create gradient for trail
          const gradient = ctx.createLinearGradient(prevScreenX, prevScreenY, screenX, screenY);
          gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
          gradient.addColorStop(0.5, `rgba(200, 220, 255, ${brightness * 0.5})`);
          gradient.addColorStop(1, `rgba(255, 255, 255, ${brightness})`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = size * 0.8;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(prevScreenX, prevScreenY);
          ctx.lineTo(screenX, screenY);
          ctx.stroke();
        }

        // Draw star point
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fill();

        // Add blue/white glow to close stars
        if (star.z < 0.3) {
          ctx.fillStyle = `rgba(150, 200, 255, ${(0.3 - star.z) * 0.5})`;
          ctx.beginPath();
          ctx.arc(screenX, screenY, size * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw cockpit vignette effect
      const vignetteGradient = ctx.createRadialGradient(
        centerX, centerY, maxDimension * 0.3,
        centerX, centerY, maxDimension * 0.8
      );
      vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignetteGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.3)');
      vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
      ctx.fillStyle = vignetteGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initial clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [speed, starCount]);

  // Touch/mouse handlers for speed boost effect
  const handleInteractionStart = useCallback(() => {
    targetSpeed.current = 3; // Boost to 3x speed on touch
  }, []);

  const handleInteractionEnd = useCallback(() => {
    targetSpeed.current = 1; // Return to normal speed
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        touchAction: 'none',
        background: '#000000',
      }}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onMouseLeave={handleInteractionEnd}
    />
  );
};

export default MobileEventHorizon;
