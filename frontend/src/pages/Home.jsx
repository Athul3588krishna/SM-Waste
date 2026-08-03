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
    <div className="relative min-h-[calc(100vh-80px)] bg-gray-950 text-white font-sans overflow-hidden flex flex-col justify-between">
      
      {/* Background Decorative Gradient Orbs & Subtle Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-gray-950 to-gray-950 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* TOP SYSTEM NAVBAR */}
      <div className="w-full border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            🌱
          </div>
          <div>
            <span className="font-bold text-sm text-white tracking-wide">EcoClean AI</span>
            <span className="text-[10px] text-gray-400 block font-mono">Smart Waste Portal v2.5</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Nodes Active</span>
          </div>
          
          <button 
            onClick={() => setShowAdminOverlay(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:border-gray-700 transition-all cursor-pointer"
          >
            <ShieldCheck size={14} className="text-cyan-400" />
            <span>Admin Gateway</span>
          </button>
        </div>
      </div>

      {/* MAIN HERO SECTION (2-Column Grid) */}
      <div className="max-w-7xl w-full mx-auto px-6 py-12 relative z-10 flex-grow flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* LEFT COLUMN: HERO INTRO & CTAs */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold self-start"
            >
              <Sparkles size={14} /> AI-Powered Smart Waste Management Portal
            </motion.div>

            <motion.h1 
              variants={titleContainer}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-none font-display"
            >
              {sentence.split("").map((char, index) => (
                <motion.span 
                  key={index} 
                  variants={letterVariant} 
                  className="inline-block"
                  style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-base text-gray-400 max-w-xl leading-relaxed"
            >
              Transforming urban sanitation with real-time AI vision diagnostics, instant geospatial garbage dump mapping, and automated dispatch for clean cities.
            </motion.p>

            {/* ACTION CTA BUTTONS */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="flex flex-wrap items-center gap-4 mt-2"
            >
              <button 
                onClick={() => navigate(user ? '/dashboard' : '/login?role=citizen')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-gray-950 font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Users size={18} />
                Open Citizen Workspace
                <ArrowRight size={16} />
              </button>

              <button 
                onClick={() => navigate(user ? '/dashboard' : '/login?role=worker')}
                className="px-6 py-3.5 rounded-xl bg-gray-900 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-500/10 font-bold text-sm tracking-wide hover:border-cyan-400 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Hammer size={18} />
                Sanitation Fleet Panel
              </button>
            </motion.div>

            {/* Micro Feature Indicators */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-900 text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1.5"><Zap size={14} className="text-emerald-400" /> Instant AI Vision</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-cyan-400" /> Proof Verification</span>
              <span className="flex items-center gap-1.5"><HeartHandshake size={14} className="text-amber-400" /> 50 Eco-Points / Report</span>
            </div>

          </div>

          {/* RIGHT COLUMN: 3D THREE.JS GLOBE */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <InteractiveGlobe onRotationChange={setLonRotation} />
          </div>

        </div>

        {/* 4 FEATURE CAPABILITIES CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          
          <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800/80 hover:border-emerald-500/40 backdrop-blur-xl transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
              🤖
            </div>
            <h4 className="text-sm font-bold text-white mb-1">AI Vision Diagnostic</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Automatically detects plastic, organic, hazardous, & e-waste severity levels.</p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800/80 hover:border-cyan-500/40 backdrop-blur-xl transition-all group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
              🗺️
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Geospatial Mapping</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Pin exact GPS coordinates on OpenStreetMap for rapid cleanup dispatch.</p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800/80 hover:border-amber-500/40 backdrop-blur-xl transition-all group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
              🏆
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Gamified Rewards</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Earn 50 Eco-Points per verified cleanup and climb city leaderboards.</p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800/80 hover:border-purple-500/40 backdrop-blur-xl transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
              👷
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Sanitation Dispatch</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Crews navigate to target zones and upload verification photos.</p>
          </div>

        </div>

        {/* ECO-SENTINEL LEADERBOARD SECTION */}
        <div className="max-w-4xl mx-auto w-full p-6 rounded-2xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">🏆 Top Eco-Warrior Citizen Rankings</h3>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">Live Leaderboard</span>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { rank: 1, name: 'Adarsh Nair', points: '1,250 pts', badge: 'Green Champion' },
              { rank: 2, name: 'Anjali Menon', points: '920 pts', badge: 'Eco Sentinel' },
              { rank: 3, name: 'Aravind Swamy', points: '780 pts', badge: 'Eco Cadet' }
            ].map((leader) => (
              <div key={leader.rank} className="flex items-center justify-between p-3 rounded-xl bg-gray-950/60 border border-gray-800/60 hover:border-gray-700 transition-all">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                    leader.rank === 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    leader.rank === 2 ? 'bg-gray-400/20 text-gray-300 border border-gray-400/40' :
                    'bg-amber-700/20 text-amber-600 border border-amber-700/40'
                  }`}>
                    {leader.rank}
                  </span>
                  <span className="text-sm font-medium text-white font-mono">{leader.name}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
                    {leader.badge}
                  </span>
                  <span className="text-sm font-bold text-cyan-300 font-mono">{leader.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* BOTTOM FOOTER & TERMINAL SEARCH BAR */}
      <div className="w-full border-t border-gray-800/80 bg-gray-950/90 py-4 px-6 relative z-20">
        <div className="max-w-md mx-auto relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
          <input
            type="text"
            placeholder="Type console command or admin key (#)..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-mono transition-all"
          />
        </div>
      </div>

      {/* SECURED ADMIN AUTHENTICATION OVERLAY */}
      {showAdminOverlay && (
        <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)] rounded-2xl w-full max-w-md p-6 relative">
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-sm font-bold text-white font-display">Secured Admin Gateway</span>
              </div>
              <button
                onClick={() => setShowAdminOverlay(false)}
                className="text-gray-400 hover:text-white text-xl p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-3 bg-red-500/10 border border-red-500/20 p-3 rounded-xl mb-5 text-left">
              <ShieldAlert size={20} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-white">RESTRICTED MUNICIPAL GATEWAY</h5>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                  Only authorized city administrators may authenticate here.
                </p>
              </div>
            </div>

            {adminError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs flex items-center gap-2 mb-4">
                <AlertCircle size={16} />
                <span>{adminError}</span>
              </div>
            )}

            <form onSubmit={handleAdminSubmit} className="space-y-4 text-left">
              <div>
                <label className="text-[11px] font-mono font-bold text-red-400 block mb-1">Admin Email</label>
                <input
                  type="email"
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  placeholder="admin@waste.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono font-bold text-red-400 block mb-1">Password</label>
                <input
                  type="password"
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs tracking-wider uppercase font-display flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                disabled={adminLoading}
              >
                <Terminal size={16} /> {adminLoading ? 'Authenticating...' : 'Sign In as Administrator'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
