import React, { useRef, useState } from 'react';

const MouseTiltCard = ({ 
  children, 
  className = '', 
  style = {}, 
  glowColor = 'rgba(16, 185, 129, 0.18)',
  tiltMax = 12,
  onClick
}) => {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, mouseX: 0, mouseY: 0, isHovered: false });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const pctX = currentX / width - 0.5;
    const pctY = currentY / height - 0.5;

    setTilt({
      rotateX: -pctY * tiltMax,
      rotateY: pctX * tiltMax,
      mouseX: currentX,
      mouseY: currentY,
      isHovered: true
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, mouseX: 0, mouseY: 0, isHovered: false });
  };

  return (
    <div
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
        transform: tilt.isHovered 
          ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(1.02)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
        transition: 'transform 0.15s ease-out',
        position: 'relative',
        ...style
      }}
    >
      {tilt.isHovered && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex: 2,
            background: `radial-gradient(450px circle at ${tilt.mouseX}px ${tilt.mouseY}px, ${glowColor}, transparent 80%)`
          }}
        />
      )}

      <div style={{ transform: 'translateZ(20px)', position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default MouseTiltCard;
