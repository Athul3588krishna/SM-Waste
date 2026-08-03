import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

const EcoCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState([]);
  const lastPos = useRef({ x: -100, y: -100 });

  // Spring physics for smooth trailing cursor ring
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { stiffness: 280, damping: 24 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disable custom cursor on touch/mobile devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    // Hide default system cursor
    const style = document.createElement('style');
    style.innerHTML = `
      @media (pointer: fine) {
        body, a, button, input, select, textarea, [role="button"], .hud-panel, .glow-btn-hud-green, .glow-btn-hud-cyan {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Eco Leaf and Flower symbols
    const ecoSymbols = ['🍃', '🌿', '☘️', '🌸', '🌼', '🌱', '🌺'];

    const addParticle = (x, y) => {
      const id = Math.random().toString(36).substring(2, 9);
      const symbol = ecoSymbols[Math.floor(Math.random() * ecoSymbols.length)];
      
      const newParticle = {
        id,
        x,
        y,
        symbol,
        size: Math.random() * 10 + 12, // 12px to 22px
        vx: (Math.random() - 0.5) * 1.8,
        vy: -Math.random() * 1.5 - 0.8, // Gently float upwards like wind
        rotate: Math.random() * 360,
        targetRotate: Math.random() * 360 + (Math.random() > 0.5 ? 180 : -180),
      };

      setParticles((prev) => [...prev.slice(-25), newParticle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 750);
    };

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 16) {
        addParticle(e.clientX, e.clientY);
        lastPos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleOver = () => setIsHovered(true);
    const handleOut = () => setIsHovered(false);

    const addHoverListeners = () => {
      const elements = document.querySelectorAll(
        'button, a, input, select, textarea, [role="button"], .hud-panel, .glow-btn-hud-green, .glow-btn-hud-cyan'
      );
      elements.forEach((el) => {
        el.addEventListener('mouseenter', handleOver);
        el.addEventListener('mouseleave', handleOut);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
      style.remove();
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Green Leaves & Blooming Flowers Trail */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ 
              opacity: 0.9, 
              scale: 0.5, 
              x: p.x, 
              y: p.y,
              rotate: p.rotate
            }}
            animate={{ 
              opacity: 0, 
              scale: 1.2, 
              x: p.x + p.vx * 30, 
              y: p.y + p.vy * 35,
              rotate: p.targetRotate
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              fontSize: `${p.size}px`,
              pointerEvents: 'none',
              zIndex: 999998,
              translateX: '-50%',
              translateY: '-50%',
              userSelect: 'none',
              filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))'
            }}
          >
            {p.symbol}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Smooth Trailing Spring Eco Aura Ring */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? 48 : 32,
          height: isHovered ? 48 : 32,
          borderRadius: '50%',
          border: isHovered 
            ? '2px solid rgba(16, 185, 129, 0.8)' 
            : '1.5px solid rgba(52, 211, 153, 0.5)',
          backgroundColor: isHovered 
            ? 'rgba(16, 185, 129, 0.12)' 
            : 'rgba(52, 211, 153, 0.05)',
          boxShadow: isHovered 
            ? '0 0 24px rgba(16, 185, 129, 0.35)' 
            : '0 0 12px rgba(52, 211, 153, 0.2)',
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 999999,
        }}
        animate={{
          scale: isHovered ? 1.3 : 1,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      />

      {/* Precision Core Pointer Dot */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? 10 : 7,
          height: isHovered ? 10 : 7,
          borderRadius: '50%',
          backgroundColor: isHovered ? '#10b981' : '#34d399',
          boxShadow: isHovered 
            ? '0 0 16px #10b981, 0 0 32px #10b981' 
            : '0 0 10px #34d399, 0 0 20px #34d399',
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 1000000,
        }}
        animate={{
          scale: isHovered ? 1.4 : 1,
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      />
    </>
  );
};

export default EcoCursor;
