import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search, Users, ShieldAlert, Hammer, ArrowRight, Sparkles, Terminal, AlertCircle, ShieldCheck, Zap, HeartHandshake, Activity, Globe, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import MouseTiltCard from '../components/MouseTiltCard';

import * as THREE from 'three';

const InteractiveGlobe = ({ onRotationChange }) => {
  const containerRef = React.useRef(null);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [screenHotspots, setScreenHotspots] = useState([]);

  const isDraggingRef = React.useRef(false);
  const previousMousePositionRef = React.useRef({ x: 0, y: 0 });
  const targetRotationRef = React.useRef({ x: 0, y: 0 });
  const earthMeshRef = React.useRef(null);

  const hotspots = [
    { id: 'pnt', lon: 76.2238, lat: 10.9752, label: 'Perinthalmanna Grid', status: 'Active Patrol', cleanedPct: '96%', badge: 'Municipal Hub' },
    { id: 'cok', lon: 76.2673, lat: 9.9312, label: 'Kochi Metro Sector', status: 'AI Scanner Operational', cleanedPct: '92%', badge: 'AI Vision Station' },
    { id: 'trv', lon: 76.9366, lat: 8.5241, label: 'Trivandrum HQ', status: 'Leaderboard Peak', cleanedPct: '98%', badge: 'Eco Warriors' },
    { id: 'ccj', lon: 75.7804, lat: 11.2588, label: 'Kozhikode Coastal', status: 'Clean Drive Active', cleanedPct: '90%', badge: 'Ocean Protect' },
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    const width = 360;
    const height = 360;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Ambient & Sun Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const backLight = new THREE.DirectionalLight(0x06b6d4, 1.2);
    backLight.position.set(-5, -2, -5);
    scene.add(backLight);

    // 3D Earth Mesh
    const geometry = new THREE.SphereGeometry(2.0, 64, 64);
    const textureLoader = new THREE.TextureLoader();

    const earthTexture = textureLoader.load('/earth.jpg');
    const material = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.5,
      metalness: 0.1,
    });

    const earthMesh = new THREE.Mesh(geometry, material);
    earthMeshRef.current = earthMesh;
    scene.add(earthMesh);

    // Outer Atmosphere Glow Ring
    const atmosphereGeometry = new THREE.SphereGeometry(2.08, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // 3D Hotspot Markers on Sphere Surface
    const marker3DItems = [];
    hotspots.forEach(h => {
      const radius = 2.02;
      const phi = (90 - h.lat) * (Math.PI / 180);
      const theta = (h.lon + 180) * (Math.PI / 180);

      const localVec = new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );

      const markerGeo = new THREE.SphereGeometry(0.05, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.position.copy(localVec);

      // Glow Ring
      const ringGeo = new THREE.RingGeometry(0.06, 0.1, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(localVec);
      ringMesh.lookAt(localVec.x * 2, localVec.y * 2, localVec.z * 2);

      earthMesh.add(markerMesh);
      earthMesh.add(ringMesh);

      marker3DItems.push({ data: h, localPos: localVec });
    });

    // 60FPS WebGL Animation Loop
    let animId;
    let frameCount = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frameCount++;

      if (!isDraggingRef.current && isAutoRotate) {
        earthMesh.rotation.y += 0.003;
      }

      earthMesh.rotation.y += (targetRotationRef.current.y - earthMesh.rotation.y) * 0.08;
      earthMesh.rotation.x += (targetRotationRef.current.x - earthMesh.rotation.x) * 0.08;

      if (onRotationChange && earthMesh) {
        const lonDeg = Math.round(((earthMesh.rotation.y / (Math.PI * 2)) * 360) % 360);
        onRotationChange(lonDeg < 0 ? 360 + lonDeg : lonDeg);
      }

      // Update projected 2D HTML coordinates every 2 frames
      if (frameCount % 2 === 0) {
        earthMesh.updateMatrixWorld();
        const coords = marker3DItems.map(item => {
          const worldVec = item.localPos.clone().applyMatrix4(earthMesh.matrixWorld);
          const isFacingFront = worldVec.z > 0.4;
          worldVec.project(camera);

          const screenX = (worldVec.x * 0.5 + 0.5) * 360;
          const screenY = (-(worldVec.y * 0.5) + 0.5) * 360;

          return {
            ...item.data,
            screenX,
            screenY,
            isVisible: isFacingFront && worldVec.z < 1,
          };
        });
        setScreenHotspots(coords);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [isAutoRotate, onRotationChange]);

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !earthMeshRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    targetRotationRef.current.y += deltaX * 0.008;
    targetRotationRef.current.x += deltaY * 0.008;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* 3D WebGL Canvas Container */}
      <div
        className="relative w-[360px] h-[360px] rounded-full overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.35)] bg-gray-950 cursor-grab active:cursor-grabbing flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div ref={containerRef} className="w-full h-full" />

        {/* 2D Projected Hotspot Location Badges over 3D Globe */}
        {screenHotspots.map((h) => {
          if (!h.isVisible) return null;
          const isSelected = selectedHotspot?.id === h.id;

          return (
            <div
              key={h.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedHotspot(isSelected ? null : h);
              }}
              style={{
                position: 'absolute',
                left: `${h.screenX}px`,
                top: `${h.screenY}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: isSelected ? 35 : 20,
                cursor: 'pointer',
              }}
              className="group"
            >
              <div className="relative flex items-center gap-1">
                <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-cyan-400 shadow-[0_0_12px_#38bdf8]' : 'bg-emerald-400 shadow-[0_0_10px_#10b981]'}`} />
                <div className="absolute -inset-1 rounded-full border border-emerald-400/80 animate-ping pointer-events-none" />
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border backdrop-blur-sm whitespace-nowrap shadow-md transition-all ${
                  isSelected 
                    ? 'bg-cyan-950/90 text-cyan-300 border-cyan-400' 
                    : 'bg-gray-950/80 text-white border-emerald-500/40 group-hover:border-emerald-400'
                }`}>
                  📍 {h.label}
                </span>
              </div>
            </div>
          );
        })}

        {/* Selected Hotspot Holographic HUD Card */}
        {selectedHotspot && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-3 left-3 right-3 bg-gray-950/95 border border-cyan-500/50 backdrop-blur-md rounded-xl p-3 z-40 text-left shadow-2xl"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                📍 {selectedHotspot.badge}
              </span>
              <button 
                onClick={() => setSelectedHotspot(null)} 
                className="text-gray-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>
            <h4 className="text-xs font-bold text-white">{selectedHotspot.label}</h4>
            <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] font-mono text-gray-300">
              <div className="bg-cyan-500/10 p-1.5 rounded border border-cyan-500/20">
                <span className="text-gray-400 block">Status:</span>
                <span className="text-emerald-400 font-bold">{selectedHotspot.status}</span>
              </div>
              <div className="bg-cyan-500/10 p-1.5 rounded border border-cyan-500/20">
                <span className="text-gray-400 block">Clean Rate:</span>
                <span className="text-cyan-300 font-bold">{selectedHotspot.cleanedPct}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="flex items-center gap-2 bg-gray-950/80 border border-gray-800 rounded-full px-3 py-1.5 backdrop-blur-sm z-30">
        <button 
          onClick={() => setIsAutoRotate(!isAutoRotate)}
          className={`text-[11px] font-mono px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 ${
            isAutoRotate 
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
              : 'bg-gray-800/50 border-gray-700 text-gray-400'
          }`}
        >
          {isAutoRotate ? '⏸ Pause Spin' : '▶ Auto Spin'}
        </button>

        <button 
          onClick={() => {
            if (earthMeshRef.current) {
              targetRotationRef.current = { x: 0, y: 0 };
              earthMeshRef.current.rotation.set(0, 0, 0);
            }
            setSelectedHotspot(null);
          }}
          className="text-[11px] font-mono px-2.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all"
        >
          🔄 Reset View
        </button>

        <span className="text-[10px] font-mono text-gray-500 hidden sm:inline">
          🌐 3D WebGL Markers
        </span>
      </div>
    </div>
  );
};

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const sentence = "AI Powered Smart Waste Management Portal";

  const titleContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.15
      }
    }
  };

  const letterVariant = {
    hidden: { opacity: 0, y: 15, filter: "blur(3px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { type: 'spring', damping: 14, stiffness: 180 }
    }
  };
  const [showAdminOverlay, setShowAdminOverlay] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [lonRotation, setLonRotation] = useState(0);

  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#' || window.location.hash === '#admin') {
        setShowAdminOverlay(true);
        setAdminError('');
        window.history.replaceState(null, null, ' ');
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    
    if (val.includes('#')) {
      setSearchQuery(val.replace('#', ''));
      setShowAdminOverlay(true);
      setAdminError('');
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminError('');
    setAdminLoading(true);

    try {
      const data = await login(adminEmail, adminPassword);
      setShowAdminOverlay(false);
      
      setAdminEmail('');
      setAdminPassword('');

      if (data.role === 'admin') {
        navigate('/dashboard');
      } else {
        setAdminError('Access denied: Account is not an Administrator.');
      }
    } catch (err) {
      setAdminError(err || 'Failed to authenticate Admin credentials.');
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'relative', 
      overflow: 'hidden', 
      minHeight: 'calc(100vh - 80px)',
      background: 'var(--bg-main)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      
      {/* Sci-Fi Global Style Overrides */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.7; }
          100% { transform: scale(0.95); opacity: 0.4; }
        }
        @keyframes radar-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orbit-rotate-clockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orbit-rotate-counter {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        
        .hud-panel {
          background: var(--bg-card);
          border: 1px solid var(--border-glass);
          border-radius: 12px;
          padding: 24px;
          backdrop-filter: blur(16px);
          box-shadow: var(--shadow-glass);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .hud-panel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--accent-gradient);
          opacity: 0.6;
        }
        .hud-panel:hover {
          border-color: rgba(6, 182, 212, 0.4);
          box-shadow: 0 15px 45px rgba(6, 182, 212, 0.1), inset 0 0 25px rgba(6, 182, 212, 0.05);
          transform: translateY(-2px);
        }

        .hud-panel-citizen::before {
          background: #10b981;
        }
        .hud-panel-worker::before {
          background: #06b6d4;
        }

        .hud-label-citizen {
          color: #10b981;
          font-family: var(--font-display);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 700;
        }
        .hud-label-worker {
          color: #06b6d4;
          font-family: var(--font-display);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 700;
        }
        
        .glow-btn-hud-green {
          background: rgba(16, 185, 129, 0.08);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 12px 20px;
          font-weight: 700;
          font-family: var(--font-display);
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justifyContent: center;
          gap: 8px;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 12.5px;
        }
        .glow-btn-hud-green:hover {
          background: #10b981;
          color: #020306;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.35);
          border-color: #10b981;
        }

        .glow-btn-hud-cyan {
          background: rgba(6, 182, 212, 0.08);
          color: #22d3ee;
          border: 1px solid rgba(6, 182, 212, 0.3);
          padding: 12px 20px;
          font-weight: 700;
          font-family: var(--font-display);
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justifyContent: center;
          gap: 8px;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 12.5px;
        }
        .glow-btn-hud-cyan:hover {
          background: #06b6d4;
          color: #020306;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.35);
          border-color: #06b6d4;
        }
        
        .grid-pattern {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.007) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.007) 1px, transparent 1px);
        }
        
        .hud-border-bracket {
          position: absolute;
          width: 12px;
          height: 12px;
          border-color: rgba(6, 182, 212, 0.4);
          border-style: solid;
        }
      `}</style>

      {/* Grid Overlay Backdrops */}
      <div className="grid-pattern" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 1 }}></div>
      <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'rgba(6, 182, 212, 0.04)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', filter: 'blur(130px)', zIndex: 2 }}></div>

      {/* TOP STATUS BAR */}
      <div style={{ 
        width: '100%', 
        borderBottom: '1px solid var(--border-glass)', 
        background: 'var(--nav-bg)', 
        padding: '12px 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        fontSize: '11px',
        fontFamily: 'monospace',
        letterSpacing: '1px',
        color: 'var(--text-secondary)',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', animation: 'pulse-ring 1s infinite' }}></span>
          <span>SYSTEM_NODE: ACT_ONLINE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>LAT_GRID: 9.9312° N</span>
          <span>LON_GRID: 76.2673° E</span>
          <span style={{ color: '#06b6d4' }}>ORBIT_ROT_Y: {lonRotation}°</span>
        </div>
      </div>

      {/* MAIN SCI-FI CONSOLE DECK */}
      <div style={{ 
        maxWidth: '1200px', 
        width: '100%', 
        margin: '0 auto', 
        padding: '30px 24px', 
        position: 'relative', 
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        flexGrow: 1,
        justifyContent: 'center'
      }}>
        
        {/* UPPER HUD BANNER */}
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              background: 'rgba(139, 92, 246, 0.05)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              padding: '5px 14px',
              borderRadius: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#c084fc',
              fontSize: '11px',
              fontWeight: '700',
              fontFamily: 'monospace',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '1.5px'
            }}
          >
            <Activity size={12} /> Diagnostic HUD Matrix v2.0
          </motion.div>
          
          <motion.h1 
            variants={titleContainer}
            initial="hidden"
            animate="visible"
            style={{ 
              fontSize: '44px', 
              fontWeight: '900', 
              lineHeight: 1.1, 
              color: 'var(--text-primary)', 
              letterSpacing: '-1.5px', 
              fontFamily: 'var(--font-display)',
              margin: 0
            }}
          >
            {sentence.split("").map((char, index) => (
              <motion.span 
                key={index} 
                variants={letterVariant} 
                style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            style={{ color: 'var(--text-secondary)', fontSize: '14.5px', maxWidth: '580px', margin: '8px auto 0', lineHeight: 1.5 }}
          >
            Automated environmental control console powered by real-time Google Gemini AI vision diagnostics and tactical sanitation crew allocation.
          </motion.p>
        </div>

        {/* 3-COLUMN CONTROL MODULE GRID */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr', 
          gap: '30px', 
          alignItems: 'center',
          marginTop: '10px'
        }} className="grid-3">
          
          {/* LEFT COLUMN: CITIZEN HUB PANEL */}
          <MouseTiltCard glowColor="rgba(16, 185, 129, 0.25)" tiltMax={10}>
            <div className="hud-panel hud-panel-citizen" style={{ height: '100%' }}>
              {/* HUD Corner Brackets */}
              <div className="hud-border-bracket" style={{ top: '8px', left: '8px', borderLeftWidth: '2px', borderTopWidth: '2px' }}></div>
              <div className="hud-border-bracket" style={{ top: '8px', right: '8px', borderRightWidth: '2px', borderTopWidth: '2px' }}></div>
              <div className="hud-border-bracket" style={{ bottom: '8px', left: '8px', borderLeftWidth: '2px', borderBottomWidth: '2px' }}></div>
              <div className="hud-border-bracket" style={{ bottom: '8px', right: '8px', borderRightWidth: '2px', borderBottomWidth: '2px' }}></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <Users size={18} color="#10b981" />
                <span className="hud-label-citizen">Telemetry: Citizens Node</span>
              </div>
              
              <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 10px 0', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                Public Portal
              </h3>
              
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '0 0 20px 0' }}>
                Allows registered citizens to catalog local sanitation anomalies, log visual diagnostics, and claim municipal point rewards.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button className="glow-btn-hud-green" onClick={() => navigate(user ? '/dashboard' : '/login?role=citizen')}>
                  Open Workspace <ArrowRight size={14} />
                </button>
                {!user && (
                  <div style={{ textAlign: 'center' }}>
                    <Link to="/register" style={{ fontSize: '12px', color: '#10b981', textDecoration: 'none', fontWeight: 'bold', fontFamily: 'monospace' }}>
                      [REGISTERATION]
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </MouseTiltCard>

          {/* CENTER COLUMN: INTERACTIVE 3D EARTH DECK */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative'
          }}>
            {/* Outer Orbit Ring 1 */}
            <div style={{
              position: 'absolute',
              width: '420px',
              height: '420px',
              border: '1px dashed rgba(6, 182, 212, 0.12)',
              borderRadius: '50%',
              animation: 'orbit-rotate-clockwise 25s infinite linear',
              pointerEvents: 'none',
              zIndex: 3
            }}>
              <div style={{ position: 'absolute', top: '10%', left: '10%', width: '6px', height: '6px', background: '#06b6d4', borderRadius: '50%' }}></div>
              <div style={{ position: 'absolute', bottom: '15%', right: '15%', width: '4px', height: '4px', background: '#8b5cf6', borderRadius: '50%' }}></div>
            </div>

            {/* Outer Orbit Ring 2 */}
            <div style={{
              position: 'absolute',
              width: '390px',
              height: '390px',
              border: '1px solid rgba(139, 92, 246, 0.08)',
              borderRadius: '50%',
              animation: 'orbit-rotate-counter 18s infinite linear',
              pointerEvents: 'none',
              zIndex: 3
            }}>
              <div style={{ position: 'absolute', top: '50%', right: '-3px', width: '6px', height: '6px', background: 'rgba(6, 182, 212, 0.5)', borderRadius: '50%' }}></div>
            </div>

            <InteractiveGlobe onRotationChange={setLonRotation} />
            
            {/* Mini HUD coordinates on globe base */}
            <div style={{
              marginTop: '16px',
              background: 'rgba(5, 7, 12, 0.6)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '4px',
              padding: '6px 14px',
              fontSize: '10px',
              fontFamily: 'monospace',
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.5px'
            }}>
              // RADAR_SWEEPING_SECTORS: Perinthalmanna_Grid_Active
            </div>
          </div>

          {/* RIGHT COLUMN: SANITATION CREW HUB PANEL */}
          <MouseTiltCard glowColor="rgba(6, 182, 212, 0.25)" tiltMax={10}>
            <div className="hud-panel hud-panel-worker" style={{ height: '100%' }}>
              {/* HUD Corner Brackets */}
              <div className="hud-border-bracket" style={{ top: '8px', left: '8px', borderLeftWidth: '2px', borderTopWidth: '2px' }}></div>
              <div className="hud-border-bracket" style={{ top: '8px', right: '8px', borderRightWidth: '2px', borderTopWidth: '2px' }}></div>
              <div className="hud-border-bracket" style={{ bottom: '8px', left: '8px', borderLeftWidth: '2px', borderBottomWidth: '2px' }}></div>
              <div className="hud-border-bracket" style={{ bottom: '8px', right: '8px', borderRightWidth: '2px', borderBottomWidth: '2px' }}></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <Hammer size={18} color="#06b6d4" />
                <span className="hud-label-worker">Telemetry: Crew Node</span>
              </div>
              
              <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 10px 0', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                Sanitation Panel
              </h3>
              
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '0 0 20px 0' }}>
                Allows dispatch crews to monitor assignments, trace mapping coordinates, verify resolutions, and trigger escrow split payouts.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button className="glow-btn-hud-cyan" onClick={() => navigate(user ? '/dashboard' : '/login?role=worker')}>
                  Open Sanitation Panel <ArrowRight size={14} />
                </button>
                <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  [SECURED_AUTHENTICATION]
                </div>
              </div>
            </div>
          </MouseTiltCard>

        </div>

        {/* LEADERBOARD DATABASE HUD PANEL */}
        <div className="hud-panel" style={{ 
          maxWidth: '960px', 
          margin: '0 auto', 
          width: '100%',
          border: '1px solid var(--border-glass)',
          background: 'var(--bg-card)',
          padding: '24px'
        }}>
          {/* HUD Corner Brackets */}
          <div className="hud-border-bracket" style={{ top: '8px', left: '8px', borderLeftWidth: '2px', borderTopWidth: '2px' }}></div>
          <div className="hud-border-bracket" style={{ top: '8px', right: '8px', borderRightWidth: '2px', borderTopWidth: '2px' }}></div>
          <div className="hud-border-bracket" style={{ bottom: '8px', left: '8px', borderLeftWidth: '2px', borderBottomWidth: '2px' }}></div>
          <div className="hud-border-bracket" style={{ bottom: '8px', right: '8px', borderRightWidth: '2px', borderBottomWidth: '2px' }}></div>

          <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={18} color="#fbbf24" />
              <span style={{ 
                color: '#fbbf24', 
                fontFamily: 'var(--font-display)', 
                fontSize: '11px', 
                textTransform: 'uppercase', 
                letterSpacing: '1px', 
                fontWeight: '700' 
              }}>Database: Eco-Sentinel Rankings</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>[QUERY_LIMIT_3]</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { rank: 1, name: 'Adarsh Nair', points: '1,250 pts', badge: 'Green Champion', status: 'SYS_ACTIVE' },
              { rank: 2, name: 'Anjali Menon', points: '920 pts', badge: 'Eco Sentinel', status: 'SYS_ACTIVE' },
              { rank: 3, name: 'Aravind Swamy', points: '780 pts', badge: 'Eco Cadet', status: 'SYS_STANDBY' }
            ].map((leader) => (
              <div key={leader.rank} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                background: 'var(--badge-bg)',
                borderRadius: '6px',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: leader.rank === 1 ? 'rgba(251,191,36,0.1)' : leader.rank === 2 ? 'rgba(156,163,175,0.1)' : 'rgba(217,119,6,0.1)',
                    color: leader.rank === 1 ? '#fbbf24' : leader.rank === 2 ? '#9ca3af' : '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}>
                    {leader.rank}
                  </span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '13.5px', fontFamily: 'monospace' }}>{leader.name}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ 
                    fontSize: '10px', 
                    color: leader.badge === 'Green Champion' ? '#fbbf24' : leader.badge === 'Eco Sentinel' ? '#06b6d4' : '#10b981', 
                    background: 'rgba(255,255,255,0.02)', 
                    border: '1px solid rgba(255,255,255,0.03)',
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    fontWeight: '600',
                    fontFamily: 'monospace'
                  }}>
                    {leader.badge}
                  </span>
                  <span style={{ fontWeight: '800', fontSize: '14px', color: '#06b6d4', fontFamily: 'monospace' }}>{leader.points}</span>
                  <span style={{ 
                    fontSize: '9px', 
                    color: leader.status === 'SYS_ACTIVE' ? '#10b981' : '#fbbf24', 
                    fontFamily: 'monospace',
                    opacity: 0.8
                  }}>{leader.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM HUD MODULES */}
        <div className="grid-3" style={{ gap: '20px', marginTop: '10px' }}>
          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'center', background: 'var(--badge-bg)', border: '1px solid var(--border-glass)' }}>
            <Zap size={18} color="#10b981" />
            <div>
              <h5 style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: '700', fontFamily: 'monospace' }}>VISION DIAGNOSTIC v1.5</h5>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>Automated classification accuracy: 98.4%</p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'center', background: 'var(--badge-bg)', border: '1px solid var(--border-glass)' }}>
            <ShieldCheck size={18} color="#06b6d4" />
            <div>
              <h5 style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: '700', fontFamily: 'monospace' }}>TACTICAL CREW ALIGN</h5>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>Response crew proximity routing enabled</p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'center', background: 'var(--badge-bg)', border: '1px solid var(--border-glass)' }}>
            <HeartHandshake size={18} color="#fbbf24" />
            <div>
              <h5 style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: '700', fontFamily: 'monospace' }}>MUNICIPAL ESCROW</h5>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>Automated points and worker reward splitting</p>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM CONSOLE INPUT FOOTER */}
      <div style={{ 
        width: '100%', 
        borderTop: '1px solid var(--border-glass)', 
        background: 'var(--nav-bg)', 
        padding: '20px 24px', 
        position: 'relative', 
        zIndex: 10
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#06b6d4', display: 'flex', alignItems: 'center' }}>
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Enter console commands or diagnostic key (#)..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '12px 20px 12px 46px',
              fontSize: '13px',
              background: 'var(--input-bg)',
              border: '1px solid var(--border-glass)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              outline: 'none',
              boxShadow: 'var(--shadow-glass)',
              transition: 'all 0.3s',
              fontFamily: 'monospace'
            }}
            className="form-input-search"
            onFocus={(e) => e.target.style.borderColor = '#06b6d4'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-glass)'}
          />
          {searchQuery && (
            <span style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '9px',
              color: '#06b6d4',
              background: 'rgba(6, 182, 212, 0.1)',
              padding: '2px 6px',
              borderRadius: '3px',
              fontWeight: 'bold',
              fontFamily: 'monospace'
            }}>
              QUERYING_NODE_
            </span>
          )}
        </div>
      </div>

      {/* SECURED ADMIN AUTHENTICATION OVERLAY */}
      {showAdminOverlay && (
        <div className="admin-secret-modal">
          <div className="admin-console-box" style={{ background: '#0a0e17', border: '1px solid rgba(255,74,90,0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.7)', borderRadius: '12px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div className="terminal-header">
                <div className="terminal-pulse-dot"></div>
                <span style={{ color: '#fff', fontFamily: 'var(--font-display)' }}>Secured Admin Gateway</span>
              </div>
              <button
                onClick={() => setShowAdminOverlay(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '20px',
                  lineHeight: '1',
                  padding: '4px'
                }}
                title="Close Gateway"
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', background: 'rgba(255,74,90,0.05)', border: '1px dashed rgba(255,74,90,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '24px' }}>
              <ShieldAlert size={20} color="var(--color-danger)" style={{ flexShrink: 0 }} />
              <div>
                <h5 style={{ fontSize: '13px', color: '#fff', fontWeight: '600', fontFamily: 'var(--font-display)' }}>AUTHORIZED ACCESS ONLY</h5>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
                  This interface handles strategic municipal deployments. Entering unauthorized keys is logged.
                </p>
              </div>
            </div>

            {adminError && (
              <div style={{
                background: 'rgba(255, 74, 90, 0.1)',
                border: '1px solid rgba(255, 74, 90, 0.2)',
                borderRadius: '8px',
                padding: '12px',
                color: 'var(--color-danger)',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px'
              }}>
                <AlertCircle size={16} />
                <span>{adminError}</span>
              </div>
            )}

            <form onSubmit={handleAdminSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--color-danger)', fontSize: '11px', fontFamily: 'var(--font-display)' }}>Admin Credentials (Email)</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@waste.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  style={{ background: '#101622', borderBottomColor: 'rgba(255, 74, 90, 0.3)', borderRadius: '6px' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--color-danger)', fontSize: '11px', fontFamily: 'var(--font-display)' }}>Console Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  style={{ background: '#101622', borderBottomColor: 'rgba(255, 74, 90, 0.3)', borderRadius: '6px' }}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-danger"
                style={{ width: '100%', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'var(--font-display)', borderRadius: '8px' }}
                disabled={adminLoading}
              >
                <Terminal size={16} /> {adminLoading ? 'Decrypting...' : 'Initiate Secure Session'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
