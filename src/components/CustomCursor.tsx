import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // To achieve a "butter smooth" and instantaneous feel, we use extremely high
  // stiffness and damping. This forces the spring to resolve almost immediately,
  // mimicking the responsiveness of the default system cursor.
  const springConfig = { damping: 90, stiffness: 5000, mass: 0.1 };

  const smoothMouse = {
    x: useSpring(mouseX, springConfig),
    y: useSpring(mouseY, springConfig),
  };

  // Both circles now use the exact same spring config to move in perfect unison,
  // removing any trailing effect and enhancing the solid, responsive feel.
  const trailingMouse = {
    x: useSpring(mouseX, springConfig),
    y: useSpring(mouseY, springConfig),
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);

    const interactiveElements = document.querySelectorAll(
      'a, button, [data-cursor="pointer"]'
    );
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [mouseX, mouseY]);

  const cursorScale = isHovering ? 1.5 : 1;
  const trailingScale = isHovering ? 0.5 : 1;

  return (
    <>
      {/* Outer trailing circle */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border-2 border-amber-400/80 rounded-full pointer-events-none z-50"
        style={{
          x: trailingMouse.x,
          y: trailingMouse.y,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{ scale: trailingScale }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      />
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-amber-400 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          x: smoothMouse.x,
          y: smoothMouse.y,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{ scale: cursorScale }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
    </>
  );
};

export default CustomCursor;
