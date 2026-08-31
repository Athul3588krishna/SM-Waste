import React, { useEffect, useState } from 'react';

const CursorFollower = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const moveCursor = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
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
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: isHovered ? 40 : 24,
          height: isHovered ? 40 : 24,
          borderRadius: '50%',
          border: isHovered ? '2px solid rgba(6, 182, 212, 0.8)' : '1.5px solid rgba(16, 185, 129, 0.6)',
          background: isHovered ? 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
          boxShadow: isHovered ? '0 0 25px rgba(6, 182, 212, 0.4)' : '0 0 15px rgba(16, 185, 129, 0.3)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'width 0.15s, height 0.15s, border 0.15s'
        }}
      />
      <div
        style={{
          position: 'fixed',
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: isHovered ? 10 : 6,
          height: isHovered ? 10 : 6,
          borderRadius: '50%',
          backgroundColor: isHovered ? '#06b6d4' : '#10b981',
          boxShadow: isHovered ? '0 0 16px #06b6d4' : '0 0 10px #10b981',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 100000,
          transition: 'width 0.15s, height 0.15s, background-color 0.15s'
        }}
      />
    </>
  );
};

export default CursorFollower;
