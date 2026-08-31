import React, { useEffect, useState } from 'react';

const EcoCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
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
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: `${pos.y}px`,
          left: `${pos.x}px`,
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
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 999999,
          transition: 'width 0.15s, height 0.15s'
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: `${pos.y}px`,
          left: `${pos.x}px`,
          width: isHovered ? 10 : 7,
          height: isHovered ? 10 : 7,
          borderRadius: '50%',
          backgroundColor: isHovered ? '#10b981' : '#34d399',
          boxShadow: isHovered 
            ? '0 0 16px #10b981, 0 0 32px #10b981' 
            : '0 0 10px #34d399, 0 0 20px #34d399',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 1000000,
          transition: 'width 0.15s, height 0.15s'
        }}
      />
    </>
  );
};

export default EcoCursor;
