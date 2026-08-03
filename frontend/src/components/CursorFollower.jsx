import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

const CursorFollower = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState([]);
  const lastPosition = useRef({ x: -100, y: -100 });
  const lastTime = useRef(Date.now());

  // Framer Motion spring cursor position for trailing ring
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const springConfig = { stiffness: 220, damping: 20 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);

  useEffect(() => {
    // Disable custom cursor on touch/mobile screens
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    // Inject CSS to hide system pointer on fine pointers
    const style = document.createElement('style');
    style.innerHTML = `
      @media (pointer: fine) {
        body, a, button, input, select, textarea, [role="button"], .glow-btn-hud-green, .glow-btn-hud-cyan {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    document.documentElement.style.cursor = 'none';

    // Generate glowing fire embers & sparkling particles on mouse movement
    const addParticle = (x, y, speed) => {
      const id = Math.random().toString(36).substring(2, 9);
      
      // Fire ember colors + Eco cyber accents: Fire Red, Orange, Amber Gold, Emerald Green, Electric Cyan
      const colors = ['#ff4500', '#ff8c00', '#fbbf24', '#10b981', '#06b6d4', '#ec4899'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Fast movement produces larger, higher velocity fire embers
      const sizeMultiplier = Math.min(Math.max(speed * 0.15, 1), 2.2);

      const newParticle = {
        id,
        x,
        y,
        color: randomColor,
        size: (Math.random() * 6 + 4) * sizeMultiplier, // 4px to 20px
        vx: (Math.random() - 0.5) * 2.2 * sizeMultiplier,
        vy: (Math.random() - 0.5) * 2.2 - 1.2 * sizeMultiplier, // Ember drifts upward
        rotation: Math.random() * 360,
        shape: Math.random() > 0.4 ? 'circle' : 'ember'
      };

      setParticles((prev) => [...prev.slice(-30), newParticle]); // Max 30 active embers for high FPS performance

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 700);
    };

    const moveCursor = (e) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      const now = Date.now();
      const dt = Math.max(now - lastTime.current, 1);
      const dx = e.clientX - lastPosition.current.x;
      const dy = e.clientY - lastPosition.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = distance / dt; // Speed factor

      if (distance > 10) {
        addParticle(e.clientX, e.clientY, speed);
        lastPosition.current = { x: e.clientX, y: e.clientY };
        lastTime.current = now;
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleOver = () => setIsHovered(true);
    const handleOut = () => setIsHovered(false);

    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'button, a, input, select, textarea, [role="button"], .glow-btn-hud-green, .glow-btn-hud-cyan, .hud-panel'
      );
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', handleOver);
        el.addEventListener('mouseleave', handleOut);
      });
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    addHoverListeners();

    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      observer.disconnect();
      document.documentElement.style.cursor = 'auto';
      style.remove();
    };
  }, [isVisible, rawX, rawY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Dynamic Fire Ember & Sparkle Particle Trail */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ 
              opacity: 0.95, 
              scale: 1, 
              x: p.x, 
              y: p.y,
              rotate: p.rotation
            }}
            animate={{ 
              opacity: 0, 
              scale: 0.1, 
              x: p.x + p.vx * 40, 
              y: p.y + p.vy * 45,
              rotate: p.rotation + 220
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              width: p.size,
              height: p.size,
              borderRadius: p.shape === 'circle' ? '50%' : '30%',
              backgroundColor: p.color,
              boxShadow: `0 0 12px ${p.color}, 0 0 24px ${p.color}`,
              pointerEvents: 'none',
              zIndex: 99998,
              translateX: '-50%',
              translateY: '-50%',
              filter: 'blur(0.5px)'
            }}
          />
        ))}
      </AnimatePresence>

      {/* Smooth Trailing Spring Outer Glow Aura Ring */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: isHovered ? 48 : 32,
          height: isHovered ? 48 : 32,
          borderRadius: '50%',
          border: isHovered ? '2px solid rgba(6, 182, 212, 0.8)' : '1.5px solid rgba(16, 185, 129, 0.6)',
          background: isHovered ? 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
          boxShadow: isHovered ? '0 0 25px rgba(6, 182, 212, 0.4)' : '0 0 15px rgba(16, 185, 129, 0.3)',
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 99999,
        }}
        animate={{
          scale: isHovered ? 1.3 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      />

      {/* Fast Instant Core Pointer Dot */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: isHovered ? 10 : 7,
          height: isHovered ? 10 : 7,
          borderRadius: '50%',
          backgroundColor: isHovered ? '#06b6d4' : '#10b981',
          boxShadow: isHovered 
            ? '0 0 16px #06b6d4, 0 0 32px #06b6d4, 0 0 48px #06b6d4' 
            : '0 0 10px #10b981, 0 0 20px #10b981',
          x: rawX,
          y: rawY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 100000,
        }}
        animate={{
          scale: isHovered ? 1.4 : 1,
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      />
    </>
  );
};

export default CursorFollower;
