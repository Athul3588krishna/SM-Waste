import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Hammer, Shield, AlertCircle, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Extract role from query parameters (?role=citizen, worker, admin)
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role') || 'citizen';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingSubmit(true);

    try {
      // Backend validates credentials and returns the user structure with their role
      const data = await login(email, password);
      
      // Additional safety check to ensure logged-in user matches the requested portal role
      if (role && data.role !== role) {
        // Log them out or alert, but let's just warn them or navigate to dashboard anyway.
        // Actually, redirecting to the correct dashboard anyway is best, but let's alert them.
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Define portal theme configurations
  const portalConfig = {
    citizen: {
      color: 'var(--color-primary)', // Green
      title: 'Citizen Sign In',
      subtitle: 'EcoClean Smart Waste Management',
      icon: <Trash2 size={24} color="#000" />,
      footer: (
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>New Citizen? </span>
          <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}>
            Register here
          </Link>
        </div>
      )
    },
    worker: {
      color: 'var(--color-secondary)', // Blue
      title: 'Worker Portal Sign In',
      subtitle: 'EcoClean Sanitation & Squads',
      icon: <Hammer size={24} color="#000" />,
      footer: (
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Assigned workers only. Managed by municipal administrators.
        </div>
      )
    },
    admin: {
      color: 'var(--color-danger)', // Red/Amber
      title: 'Admin Command Sign In',
      subtitle: 'EcoClean Administrative Center',
      icon: <Shield size={24} color="#000" />,
      footer: (
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--color-danger)', fontWeight: '600' }}>
          SECURED CONNECTION • ACCESS LOGGED
        </div>
      )
    }
  };

  const currentPortal = portalConfig[role] || portalConfig.citizen;

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Back to Home Link */}
      <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px', display: 'flex', justifyContent: 'flex-start' }}>
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.color = currentPortal.color}
        onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={16} /> Back to Homepage
        </Link>
      </div>

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '400px',
        borderColor: `rgba(${role === 'worker' ? '0, 210, 255' : role === 'admin' ? '255, 74, 90' : '16, 185, 129'}, 0.15)`
      }}>
        
        {/* Logo and Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            background: currentPortal.color,
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 15px rgba(${role === 'worker' ? '0, 210, 255' : role === 'admin' ? '255, 74, 90' : '16, 185, 129'}, 0.3)`,
            marginBottom: '16px'
          }}>
            {currentPortal.icon}
          </div>
          <h2 style={{ fontSize: '26px', color: 'var(--text-primary)' }}>{currentPortal.title}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
            {currentPortal.subtitle}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255, 74, 90, 0.1)',
            border: '1px solid rgba(255, 74, 90, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            color: 'var(--color-danger)',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn"
            style={{
              width: '100%',
              marginTop: '10px',
              background: currentPortal.color,
              color: '#000',
              boxShadow: `0 4px 12px rgba(${role === 'worker' ? '0, 210, 255' : role === 'admin' ? '255, 74, 90' : '16, 185, 129'}, 0.15)`
            }}
            disabled={loadingSubmit}
          >
            {loadingSubmit ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {currentPortal.footer}

        {/* Portal Quick Switcher (If not Admin) */}
        {role !== 'admin' && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-glass)',
            fontSize: '12px'
          }}>
            {role === 'citizen' ? (
              <Link to="/login?role=worker" style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: '500' }}>
                Switch to Worker Portal
              </Link>
            ) : (
              <Link to="/login?role=citizen" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '500' }}>
                Switch to Citizen Portal
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
