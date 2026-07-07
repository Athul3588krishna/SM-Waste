import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Search, Users, ShieldAlert, Hammer, ArrowRight, Shield, Sparkles, Terminal, AlertCircle } from 'lucide-react';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdminOverlay, setShowAdminOverlay] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkHash = () => {
      // Trigger if URL ends with # or #admin
      if (window.location.hash === '#' || window.location.hash === '#admin') {
        setShowAdminOverlay(true);
        setAdminError('');
        // Clean the hash from the browser address bar dynamically
        window.history.replaceState(null, null, ' ');
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    
    // Secret trigger: if user types # anywhere in the search input
    if (val.includes('#')) {
      setSearchQuery(val.replace('#', '')); // strip the hash
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
      
      // Clear forms
      setAdminEmail('');
      setAdminPassword('');

      // Redirect to workspace
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
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: 'calc(100vh - 80px)' }}>
      {/* Premium background decorative shapes */}
      <div className="floating-blob" style={{ width: '400px', height: '400px', background: 'var(--color-primary)', top: '-10%', left: '-10%' }}></div>
      <div className="floating-blob" style={{ width: '500px', height: '500px', background: 'var(--color-secondary)', bottom: '-20%', right: '-10%', animationDelay: '-4s' }}></div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px', position: 'relative', zIndex: 5 }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            padding: '8px 16px',
            borderRadius: '30px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--color-primary)',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '24px'
          }}>
            <Sparkles size={14} /> Smart Sanitation Command & Reporting Network
          </div>
          
          <h1 style={{ fontSize: '56px', fontWeight: '800', lineHeight: 1.1, marginBottom: '20px' }}>
            Keeping Our City Clean <br />
            <span className="text-gradient">With Smart Tech Solutions</span>
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>
            Report local environmental concerns, track cleaning deployments in real-time, and earn rewards for active community citizenship.
          </p>

          {/* Interactive Search Bar (Secret Gate) */}
          <div style={{ maxWidth: '580px', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search reports or enter secret console access key (#)..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                padding: '18px 24px 18px 60px',
                fontSize: '16px',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid var(--border-glass)',
                borderRadius: '30px',
                color: 'var(--text-primary)',
                outline: 'none',
                boxShadow: 'var(--shadow-glass)',
                transition: 'all 0.3s'
              }}
              className="form-input-search"
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-glass)'}
            />
            {searchQuery && (
              <span style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '11px',
                color: 'var(--text-muted)',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '4px 8px',
                borderRadius: '6px'
              }}>
                Searching...
              </span>
            )}
          </div>
        </div>

        {/* Portal Entry Selection Cards */}
        <div className="grid-2" style={{ maxWidth: '900px', margin: '0 auto 80px' }}>
          
          {/* Citizen Portal Card */}
          <div className="portal-card portal-card-citizen" onClick={() => navigate(user ? '/dashboard' : '/login?role=citizen')}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '16px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.1)'
            }}>
              <Users size={32} />
            </div>
            <h3 style={{ fontSize: '22px', color: 'var(--text-primary)' }}>Citizen Portal</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, flexGrow: 1 }}>
              Submit new waste complaints with geolocations, track cleaning progress, get notifications, and earn points to redeem special badges.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px', marginTop: '10px' }}>
              <button className="btn btn-primary" style={{ width: '100%', pointerEvents: 'none' }}>
                Access Citizen Portal <ArrowRight size={16} />
              </button>
              {!user && (
                <Link to="/register" style={{ fontSize: '13px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '500' }} onClick={(e) => e.stopPropagation()}>
                  New Citizen? Register here
                </Link>
              )}
            </div>
          </div>

          {/* Sanitation Worker Portal Card */}
          <div className="portal-card portal-card-worker" onClick={() => navigate(user ? '/dashboard' : '/login?role=worker')}>
            <div style={{
              background: 'rgba(0, 210, 255, 0.1)',
              padding: '16px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-secondary)',
              boxShadow: '0 0 15px rgba(0, 210, 255, 0.1)'
            }}>
              <Hammer size={32} />
            </div>
            <h3 style={{ fontSize: '22px', color: 'var(--text-primary)' }}>Worker Portal</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, flexGrow: 1 }}>
              Sanitation employees and cleaning squads can view assigned tasks, update completion statuses with pictures, and claim bonus points.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px', marginTop: '10px' }}>
              <button className="btn btn-secondary" style={{ width: '100%', borderColor: 'rgba(0, 210, 255, 0.2)', color: 'var(--color-secondary)', pointerEvents: 'none' }}>
                Access Sanitation Portal <ArrowRight size={16} />
              </button>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Managed by Authority Admin</span>
            </div>
          </div>

        </div>

        {/* Dynamic Stats Row */}
        <div className="grid-3" style={{ marginBottom: '80px' }}>
          <div className="stat-card">
            <h4 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--color-primary)' }}>1,420+</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Waste Incidents Reported</p>
          </div>
          <div className="stat-card">
            <h4 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--color-secondary)' }}>95.4%</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Resolution Success Rate</p>
          </div>
          <div className="stat-card">
            <h4 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--color-warning)' }}>1.2 Hours</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Average Response Time</p>
          </div>
        </div>

        {/* Redefined Leaderboard Preview (Mock details to match gamification design) */}
        <div className="glass-panel" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles color="var(--color-warning)" size={20} /> Community Eco Leaderboard
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Top Cleaners this month</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { rank: 1, name: 'Adarsh Nair', points: '1250 pts', badge: 'Green Sentinel' },
              { rank: 2, name: 'Anjali Menon', points: '920 pts', badge: 'Eco Cadet' },
              { rank: 3, name: 'Aravind Swamy', points: '780 pts', badge: 'Novice Reporter' }
            ].map((leader) => (
              <div key={leader.rank} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: leader.rank === 1 ? 'var(--color-warning)' : leader.rank === 2 ? '#d1d5db' : '#b45309',
                    color: '#000',
                    fontSize: '12px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {leader.rank}
                  </span>
                  <span style={{ fontWeight: '600' }}>{leader.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-primary)', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '6px' }}>
                    {leader.badge}
                  </span>
                  <span style={{ fontWeight: '700', fontSize: '14px' }}>{leader.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Secret Admin Authentication Overlay */}
      {showAdminOverlay && (
        <div className="admin-secret-modal">
          <div className="admin-console-box">
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div className="terminal-header">
                <div className="terminal-pulse-dot"></div>
                <span>Secured Admin Gateway</span>
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
                <h5 style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600' }}>AUTHORIZED ACCESS ONLY</h5>
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
                <label className="form-label" style={{ color: 'var(--color-danger)' }}>Admin Credentials (Email)</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@waste.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  style={{ borderBottomColor: 'rgba(255, 74, 90, 0.3)' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--color-danger)' }}>Console Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  style={{ borderBottomColor: 'rgba(255, 74, 90, 0.3)' }}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-danger"
                style={{ width: '100%', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
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
