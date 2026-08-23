import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import EcoCreditCard from '../components/EcoCreditCard';
import { Award, PlusCircle, AlertCircle, Clock, MapPin, CheckCircle2, ChevronRight, Trophy, Megaphone, Calendar, Lock, Gift } from 'lucide-react';

const ConfettiPopper = () => {
  const particleCount = 80;
  const styles = [];
  const elements = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 260;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance + 120; // gravity fall
    const size = 6 + Math.random() * 8;
    const r = Math.random() * 720;
    const delay = Math.random() * 0.25;
    const colors = ['#a78bfa', '#06b6d4', '#10b981', '#fbbf24', '#ef4444', '#ec4899'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const animName = `confetti-burst-${i}`;

    styles.push(`
      @keyframes ${animName} {
        0% {
          transform: translate(0, 0) scale(1.2) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translate(${x}px, ${y}px) scale(0.3) rotate(${r}deg);
          opacity: 0;
        }
      }
      .confetti-particle-${i} {
        position: absolute;
        top: 50%;
        left: 50%;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        z-index: 10000;
        pointer-events: none;
        animation: ${animName} 1.8s cubic-bezier(0.1, 0.8, 0.3, 1) ${delay}s forwards;
      }
    `);

    elements.push(<div key={i} className={`confetti-particle-${i}`} />);
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles.join('\n') }} />
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 10000 }}>
        {elements}
      </div>
    </>
  );
};

const CitizenDashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const { socket } = useSocket();
  const [complaints, setComplaints] = useState([]);
  const [leaderboard, setLeaderboard] = useState({ citizens: [], workers: [] });
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Rewards States
  const [activeSubTab, setActiveSubTab] = useState('complaints'); // 'complaints' or 'rewards'
  const [redeeming, setRedeeming] = useState(null); // stores active voucher being redeemed
  const [voucherCode, setVoucherCode] = useState('');
  const [redeemingState, setRedeemingState] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const fetchDashboardData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      // Refresh user context
      const userRes = await API.get('/auth/me');
      setUser(userRes.data);

      // Fetch complaints
      const complaintsRes = await API.get('/complaints/citizen');
      setComplaints(complaintsRes.data);

      // Fetch leaderboard
      const leaderboardRes = await API.get('/auth/leaderboard');
      setLeaderboard(leaderboardRes.data);

      // Fetch announcements
      const announcementsRes = await API.get('/notifications/announcements');
      setAnnouncements(announcementsRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [setUser]);

  useEffect(() => {
    fetchDashboardData(true);

    // Fallback polling interval every 15 seconds to ensure zero stale state
    const interval = setInterval(() => {
      fetchDashboardData(false);
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Real-time socket event listeners for instant auto-refresh
  useEffect(() => {
    if (!socket) return;

    const handleRealtimeUpdate = () => {
      fetchDashboardData(false);
    };

    socket.on('complaint_updated', handleRealtimeUpdate);
    socket.on('complaint_status_updated', handleRealtimeUpdate);
    socket.on('task_in_progress', handleRealtimeUpdate);
    socket.on('task_cleaned', handleRealtimeUpdate);
    socket.on('complaint_completed', handleRealtimeUpdate);
    socket.on('points_updated', handleRealtimeUpdate);
    socket.on('new_announcement', handleRealtimeUpdate);

    return () => {
      socket.off('complaint_updated', handleRealtimeUpdate);
      socket.off('complaint_status_updated', handleRealtimeUpdate);
      socket.off('task_in_progress', handleRealtimeUpdate);
      socket.off('task_cleaned', handleRealtimeUpdate);
      socket.off('complaint_completed', handleRealtimeUpdate);
      socket.off('points_updated', handleRealtimeUpdate);
      socket.off('new_announcement', handleRealtimeUpdate);
    };
  }, [socket, fetchDashboardData]);

  const playSuccessSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playNote = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      playNote(523.25, ctx.currentTime, 0.15); // C5 (Do)
      playNote(783.99, ctx.currentTime + 0.12, 0.45); // G5 (So)
    } catch (err) {
      console.warn('AudioContext failed to play success sound:', err);
    }
  };

  const handleRedeem = async (voucherName, cost) => {
    if ((user?.points || 0) < cost) {
      alert('Insufficient Eco-Points');
      return;
    }

    const confirmRedeem = window.confirm(`Are you sure you want to spend ${cost} Eco-Points to redeem "${voucherName}"?`);
    if (!confirmRedeem) return;

    setRedeemingState(true);
    try {
      const res = await API.put('/auth/redeem', { pointsToDeduct: cost, voucherName });
      setUser({ ...user, points: res.data.points, badge: res.data.badge });
      
      // Generate a random mock voucher code
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = 'ECO-';
      for (let i = 0; i < 8; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      
      setVoucherCode(code);
      setRedeeming({ name: voucherName, cost, code });
      setShowConfetti(true);
      playSuccessSound();

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`Congratulations! ${voucherName} redeemed successfully.`);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Points redemption failed');
    } finally {
      setRedeemingState(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={14} color="var(--color-warning)" />;
      case 'completed': return <CheckCircle2 size={14} color="var(--color-primary)" />;
      case 'cleaned': return <CheckCircle2 size={14} color="var(--color-primary)" style={{ opacity: 0.5 }} />;
      case 'assigned':
      case 'in_progress': return <MapPin size={14} color="var(--color-secondary)" />;
      default: return <MapPin size={14} color="var(--text-muted)" />;
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'verified': return 'status-verified';
      case 'assigned': return 'status-assigned';
      case 'in_progress': return 'status-assigned';
      case 'cleaned': return 'status-verified'; // Styled as verified/info state
      case 'completed': return 'status-completed';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  const getBadgeProgress = (points) => {
    if (points < 100) return { min: 0, max: 100, pct: (points / 100) * 100, next: 'Eco Cadet' };
    if (points < 300) return { min: 100, max: 300, pct: ((points - 100) / 200) * 100, next: 'Eco Sentinel' };
    if (points < 600) return { min: 300, max: 600, pct: ((points - 300) / 300) * 100, next: 'Eco Warrior' };
    return { min: 600, max: 1000, pct: 100, next: 'Maximum Level' };
  };

  const progress = getBadgeProgress(user?.points || 0);

  const handlePrintCertificate = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Eco-Appreciation Certificate - ${user?.name}</title>
          <style>
            body {
              font-family: 'Georgia', serif;
              background: #fdfdfd;
              color: #333;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .certificate-container {
              border: 12px double #b45309;
              padding: 50px 40px;
              width: 700px;
              background: #fff;
              text-align: center;
              position: relative;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .title {
              font-size: 38px;
              color: #b45309;
              margin-bottom: 20px;
              text-transform: uppercase;
              letter-spacing: 2px;
              font-weight: bold;
            }
            .subtitle {
              font-size: 16px;
              font-weight: 600;
              letter-spacing: 3px;
              margin-bottom: 30px;
              color: #777;
              text-transform: uppercase;
            }
            .name {
              font-size: 32px;
              font-weight: bold;
              text-decoration: underline;
              color: #111;
              margin-bottom: 25px;
              font-style: italic;
            }
            .text {
              font-size: 16px;
              line-height: 1.6;
              color: #444;
              margin-bottom: 45px;
            }
            .signature-section {
              display: flex;
              justify-content: space-around;
              margin-top: 50px;
            }
            .signature {
              border-top: 1px dashed #999;
              width: 220px;
              padding-top: 8px;
              font-size: 13px;
              color: #555;
              font-family: sans-serif;
            }
            .stamp {
              position: absolute;
              bottom: 40px;
              right: 40px;
              width: 90px;
              height: 90px;
              border: 3px double #10b981;
              border-radius: 50%;
              color: #10b981;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 11px;
              font-weight: bold;
              text-transform: uppercase;
              transform: rotate(-15deg);
              background: rgba(16, 185, 129, 0.05);
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <div class="title">Certificate of Appreciation</div>
            <div class="subtitle">PROUDLY PRESENTED TO</div>
            <div class="name">${user?.name}</div>
            <div class="text">
              in recognition of their outstanding citizen partnership, active waste reporting, and dedicated environmental preservation contributions towards achieving a zero-waste clean community in <strong>Perinthalmanna Municipality</strong>.
            </div>
            <div class="signature-section">
              <div class="signature">Municipal Authority</div>
              <div class="signature">EcoClean Programme Director</div>
            </div>
            <div class="stamp">EcoClean<br/>Certified</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Profile Card & Gamification */}
      <div className="glass-panel" style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Citizen Portal Workspace
            </span>
            <h1 style={{ fontSize: '30px', color: 'var(--text-primary)', marginTop: '4px' }}>
              Welcome back, {user?.name}
            </h1>
          </div>
          <Link to="/report" className="btn btn-primary" style={{ padding: '10px 20px' }}>
            <PlusCircle size={16} /> Report Waste
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '20px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-glass)',
          borderRadius: '12px'
        }} className="grid-3">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '2px solid var(--color-primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-neon)'
            }}>
              <Award size={24} color="var(--color-primary)" />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rank Rank</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>{user?.badge}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="flex-between" style={{ marginBottom: '8px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Points: <strong>{user?.points}</strong></span>
              <span style={{ color: 'var(--text-muted)' }}>Next Rank: <strong>{progress.next}</strong> ({progress.max} pts)</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progress.pct}%`, height: '100%', background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))', borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'md-flex-end' }}>
            {user?.points >= 100 ? (
              <button 
                onClick={handlePrintCertificate}
                className="btn btn-outline"
                style={{ width: '100%', padding: '10px 14px', fontSize: '12.5px', borderColor: 'var(--color-primary)', color: 'var(--color-primary)', cursor: 'pointer' }}
              >
                📜 Print Certificate
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.65 }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right', width: '100%' }}>
                  🔒 Earn 100 points to unlock Certificate
                </span>
              </div>
            )}
          </div>

        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(255, 74, 90, 0.1)',
          border: '1px solid rgba(255, 74, 90, 0.2)',
          borderRadius: '8px',
          padding: '12px',
          color: 'var(--color-danger)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px'
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Main content layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }} className="grid-3">
        
        {/* Left Side: Leaderboard */}
        <div className="glass-panel" style={{ alignSelf: 'start', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Trophy size={18} color="var(--color-warning)" />
            <h3 style={{ fontSize: '16px', color: 'var(--text-primary)' }}>Eco Leaderboard</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '4px' }}>
                Top Citizens
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {leaderboard.citizens.map((citizen, idx) => (
                  <div key={citizen._id} className="flex-between" style={{
                    padding: '8px 10px',
                    background: citizen._id === user?._id ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.01)',
                    border: citizen._id === user?._id ? '1px solid var(--color-primary)' : '1px solid transparent',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '800' }}>
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                      </span>
                      <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{citizen.name}</span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-primary)' }}>{citizen.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Side: Dynamic Tabs (Reported List vs Rewards Center) */}
        <div className="glass-panel" style={{ gridColumn: 'span 2' }}>
          
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-glass)', marginBottom: '20px', paddingBottom: '10px', gap: '20px' }}>
            <button 
              onClick={() => setActiveSubTab('complaints')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: activeSubTab === 'complaints' ? 'var(--color-primary)' : 'var(--text-secondary)',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                borderBottom: activeSubTab === 'complaints' ? '2px solid var(--color-primary)' : '2px solid transparent',
                paddingBottom: '8px',
                transition: 'all 0.3s'
              }}
            >
              My Reported Dumps ({complaints.length})
            </button>
            <button 
              onClick={() => setActiveSubTab('rewards')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: activeSubTab === 'rewards' ? 'var(--color-primary)' : 'var(--text-secondary)',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                borderBottom: activeSubTab === 'rewards' ? '2px solid var(--color-primary)' : '2px solid transparent',
                paddingBottom: '8px',
                transition: 'all 0.3s'
              }}
            >
              Eco-Rewards Center 🎁
            </button>
          </div>

          {activeSubTab === 'complaints' ? (
            <div>
              {complaints.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed var(--border-glass)', borderRadius: '12px' }}>
                  <MapPin size={40} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>You haven't reported any waste dumps yet.</p>
                  <Link to="/report" className="btn btn-outline" style={{ marginTop: '16px', display: 'inline-flex' }}>
                    Report First Incident
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {complaints.map((complaint) => (
                    <Link
                      key={complaint._id}
                      to={`/complaint/${complaint._id}`}
                      style={{ textDecoration: 'none', display: 'block', transition: 'transform 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                    >
                      <div style={{
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '12px',
                        padding: '14px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '220px' }}>
                          <div style={{
                            width: '54px',
                            height: '54px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            background: '#090d16',
                            border: '1px solid var(--border-glass)'
                          }}>
                            <img
                              src={complaint.photoBefore.startsWith('http') ? complaint.photoBefore : `http://localhost:5002${complaint.photoBefore}`}
                              alt="waste dump"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <div>
                            <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '600' }}>{complaint.title}</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={11} /> {complaint.location.address.slice(0, 40)}{complaint.location.address.length > 40 ? '...' : ''}
                            </p>
                            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                              <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
                                {complaint.wasteType}
                              </span>
                              <span style={{
                                fontSize: '10px',
                                background: complaint.severity === 'High' ? 'rgba(255, 74, 90, 0.1)' : 'rgba(255,255,255,0.04)',
                                color: complaint.severity === 'High' ? 'var(--color-danger)' : 'var(--text-secondary)',
                                padding: '2px 6px',
                                borderRadius: '4px'
                              }}>
                                {complaint.severity}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span className={`badge-status ${getBadgeClass(complaint.status)}`} style={{ fontSize: '11px', padding: '2px 10px' }}>
                            {getStatusIcon(complaint.status)}
                            {complaint.status.replace('_', ' ')}
                          </span>
                          <ChevronRight size={16} color="var(--text-muted)" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Realistic 3D Glassmorphic Eco Credit Card Header */}
              <div style={{
                marginBottom: '28px',
                padding: '24px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '16px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                alignItems: 'center'
              }}>
                <EcoCreditCard
                  holderName={user?.name || 'CITIZEN'}
                  cardNumber={`4582 ${user?._id ? user._id.slice(-4).padStart(4, '0') : '8910'} 3412 ${user?.points || 0}`}
                  expiryDate="12/28"
                  balanceText={`${user?.points || 0} PTS`}
                  cardType="CITIZEN ECO-CARD"
                  rankBadge={user?.badge || 'ECO CADET'}
                  theme="emerald"
                />

                <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--color-primary)', borderRadius: '20px', padding: '4px 12px', width: 'fit-content' }}>
                    <Gift size={14} color="var(--color-primary)" />
                    <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      Official Municipal Eco-Wallet
                    </span>
                  </div>

                  <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', margin: 0 }}>
                    Digital Eco-Reward Credit Card
                  </h3>

                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                    Your digital Eco-Card accumulates rewards for every verified garbage dump clean-up report you submit. Spend your available <strong style={{ color: 'var(--color-primary)' }}>{user?.points || 0} Eco-Points</strong> to redeem official municipal tax discounts and utility coupons below.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  {
                    name: '5% Municipal Services Tax Discount',
                    cost: 50,
                    badgeReq: 'Eco Cadet',
                    desc: 'Deduct 50 points to receive a voucher code providing 5% off on your municipal service tax bill.',
                  },
                  {
                    name: '10% Municipal Water Bill Coupon',
                    cost: 100,
                    badgeReq: 'Eco Sentinel',
                    desc: 'Deduct 100 points to claim a 10% discount on your municipal water utility billing.',
                  },
                  {
                    name: '15% Annual Property Tax Voucher',
                    cost: 250,
                    badgeReq: 'Green Champion',
                    desc: 'Spend 250 points to unlock a premium 15% discount voucher on your annual property tax.',
                  }
                ].map((reward, rewardIdx) => {
                  const isPointsEnough = (user?.points || 0) >= reward.cost;
                  
                  // Evaluate rank eligibility
                  const userRankWeight = 
                    user?.badge === 'Green Champion' ? 3 :
                    user?.badge === 'Eco Sentinel' ? 2 :
                    user?.badge === 'Eco Cadet' ? 1 : 0;

                  const reqRankWeight = 
                    reward.badgeReq === 'Green Champion' ? 3 :
                    reward.badgeReq === 'Eco Sentinel' ? 2 :
                    reward.badgeReq === 'Eco Cadet' ? 1 : 0;

                  const isRankEnough = userRankWeight >= reqRankWeight;
                  const isEligible = isPointsEnough && isRankEnough;

                  return (
                    <div key={rewardIdx} style={{
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '16px',
                      opacity: isRankEnough ? 1 : 0.6
                    }}>
                      <div style={{ flex: 1, minWidth: '240px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '18px' }}>🎁</span>
                          <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '700' }}>{reward.name}</h4>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.4' }}>{reward.desc}</p>
                        
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                            Cost: {reward.cost} pts
                          </span>
                          <span style={{ 
                            fontSize: '11px', 
                            background: isRankEnough ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                            color: isRankEnough ? 'var(--color-secondary)' : 'var(--color-danger)', 
                            padding: '2px 8px', 
                            borderRadius: '4px',
                            fontWeight: '600'
                          }}>
                            Rank Req: {reward.badgeReq}
                          </span>
                        </div>
                      </div>

                      <div>
                        {isEligible ? (
                          <button 
                            className="btn btn-primary"
                            onClick={() => handleRedeem(reward.name, reward.cost)}
                            style={{ padding: '8px 16px', fontSize: '12px' }}
                            disabled={redeemingState}
                          >
                            Redeem Reward
                          </button>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '12px', background: 'rgba(255,255,255,0.03)', padding: '8px 14px', borderRadius: '8px', border: '1px dashed var(--border-glass)' }}>
                            <Lock size={12} />
                            <span>{!isRankEnough ? `Requires ${reward.badgeReq}` : 'Need More Points'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Announcements Feed */}
        <div className="glass-panel" style={{ alignSelf: 'start', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Megaphone size={18} color="var(--color-secondary)" />
            <h3 style={{ fontSize: '16px', color: 'var(--text-primary)' }}>Municipality Bulletins</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '450px', overflowY: 'auto' }}>
            {announcements.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '12px' }}>
                No active announcements.
              </div>
            ) : (
              announcements.map((a) => (
                <div key={a._id} style={{
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.01)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '10px',
                }}>
                  <h4 style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600' }}>{a.title}</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.4' }}>
                    {a.content}
                  </p>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={10} /> {new Date(a.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {showConfetti && <ConfettiPopper />}

      {/* VOUCHER REDEEMED MODAL OVERLAY */}
      {redeeming && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', textAlign: 'center', padding: '30px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              border: '2px solid var(--color-primary)',
              boxShadow: 'var(--shadow-neon)'
            }}>
              <Gift size={32} color="var(--color-primary)" />
            </div>
            
            <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '8px' }}>Eco-Voucher Redeemed!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.4' }}>
              Successfully redeemed <strong style={{ color: 'var(--text-primary)' }}>{redeeming.cost} Eco-Points</strong> for:
            </p>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-secondary)', marginTop: '8px' }}>
              {redeeming.name}
            </div>

            <div style={{
              background: '#090d16',
              border: '2px dashed var(--color-primary)',
              borderRadius: '8px',
              padding: '16px',
              margin: '24px 0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Your Discount Code
              </div>
              <div style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: 'var(--color-primary)',
                fontFamily: 'monospace',
                letterSpacing: '3px',
                textShadow: '0 0 8px rgba(16, 185, 129, 0.5)'
              }}>
                {redeeming.code}
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: '1.4', marginBottom: '24px' }}>
              Apply this coupon code during tax payments or utility bills via the municipality website to claim your discount.
            </p>

            <button 
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => { setRedeeming(null); setShowConfetti(false); }}
            >
              Close & Dismiss
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CitizenDashboard;
