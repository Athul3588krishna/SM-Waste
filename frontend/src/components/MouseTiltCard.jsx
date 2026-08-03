import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const MouseTiltCard = ({ 
  children, 
  className = '', 
  style = {}, 
  glowColor = 'rgba(16, 185, 129, 0.18)',
  tiltMax = 12,
  onClick
}) => {
  const ref = useRef(null);

  // Motion values for normalized mouse positions (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Exact pixel offsets for spotlight follow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for 3D tilt angles
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [tiltMax, -tiltMax]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-tiltMax, tiltMax]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Width & height of card
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card top-left
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // Set pixel position for spotlight
    mouseX.set(currentX);
    mouseY.set(currentY);

    // Set normalized values from -0.5 to 0.5 for tilt center alignment
    const pctX = currentX / width - 0.5;
    const pctY = currentY / height - 0.5;

    x.set(pctX);
    y.set(pctY);
  };

  const handleMouseLeave = () => {
    // Smoothly reset back to center
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
        position: 'relative',
        ...style
      }}
      whileHover={{ scale: 1.02, zIndex: 5 }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
    >
      {/* Dynamic Cursor Spotlight Overlay */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 2,
          background: useTransform(
            [mouseX, mouseY],
            ([latestX, latestY]) => 
              `radial-gradient(450px circle at ${latestX}px ${latestY}px, ${glowColor}, transparent 80%)`
          )
        }}
      />

      {/* Content wrapper with depth translate */}
      <div style={{ transform: 'translateZ(20px)', position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        {children}
      </div>
    </motion.div>
  );
};

export default MouseTiltCard;
