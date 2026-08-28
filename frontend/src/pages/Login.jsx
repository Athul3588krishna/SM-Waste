import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Hammer, Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Forgot Password States
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState(1);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const handleRequestResetOtp = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    setResetSuccess('');
    try {
      await API.post('/auth/forgot-password', { email: resetEmail });
      setResetSuccess('OTP code sent successfully! Please check your email inbox.');
      setResetStep(2);
    } catch (err) {
      setResetError(err.response?.data?.message || 'Failed to send OTP code');
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    setResetSuccess('');
    try {
      await API.post('/auth/reset-password', { email: resetEmail, otp: resetOtp, newPassword });
      setResetSuccess('Password reset successful! Closing...');
      setTimeout(() => {
        setShowResetModal(false);
      }, 2000);
    } catch (err) {
      setResetError(err.response?.data?.message || 'Password reset failed');
    } finally {
      setResetLoading(false);
    }
  };
  
  const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine portal role from URL parameters, hash, or path
  const queryParams = new URLSearchParams(location.search);
  let role = queryParams.get('role') || 'citizen';
  
  const hash = location.hash.toLowerCase();
  const path = location.pathname.toLowerCase();

  if (hash === '#admin' || hash === '#/admin' || path === '/admin') {
    role = 'admin';
  } else if (hash === '#worker' || hash === '#/worker' || path === '/worker') {
    role = 'worker';
  } else if (hash === '#citizen' || hash === '#/citizen' || path === '/citizen') {
    role = 'citizen';
  }

  // Automatically redirect logged-in users to their appropriate dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'worker') {
        navigate('/worker');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address (e.g. name@example.com)');
      return;
    }

    // Validate password minlength
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoadingSubmit(true);

    try {
      // Backend validates credentials and returns the user object
      const data = await login(email, password);
      
      // Navigate seamlessly based on authenticated user's actual role
      if (data.role === 'admin') {
        navigate('/admin');
      } else if (data.role === 'worker') {
        navigate('/worker');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check credentials.');
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px', marginBottom: '18px' }}>
            <span 
              onClick={() => {
                setResetEmail('');
                setResetOtp('');
                setNewPassword('');
                setResetStep(1);
                setResetError('');
                setResetSuccess('');
                setShowResetModal(true);
              }} 
              style={{ color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
              onMouseEnter={(e) => e.target.style.color = currentPortal.color}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            >
              Forgot Password?
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: `0 6px 20px rgba(${role === 'worker' ? '0, 210, 255' : role === 'admin' ? '255, 74, 90' : '16, 185, 129'}, 0.3)` }}
            whileTap={{ scale: 0.98 }}
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
          </motion.button>
        </form>

        {currentPortal.footer}

        {/* Quick Demo Credentials Bar for Presentation & Evaluation */}
        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px dashed var(--border-glass)'
        }}>
          <div style={{
            fontSize: '11px',
            letterSpacing: '0.5px',
            color: 'var(--text-muted)',
            marginBottom: '10px',
            textAlign: 'center',
            fontWeight: '700',
            textTransform: 'uppercase'
          }}>
            ⚡ Quick Demo Logins (Evaluation 1)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@waste.com');
                setPassword('admin123');
                navigate('/login?role=admin');
              }}
              className="btn"
              style={{
                padding: '8px 4px',
                fontSize: '11px',
                background: 'rgba(255, 74, 90, 0.12)',
                color: '#FF4A5A',
                border: '1px solid rgba(255, 74, 90, 0.3)',
                borderRadius: '8px',
                fontWeight: '600'
              }}
              title="Autofill Admin Credentials"
            >
              🛡️ Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('worker1@waste.com');
                setPassword('worker123');
                navigate('/login?role=worker');
              }}
              className="btn"
              style={{
                padding: '8px 4px',
                fontSize: '11px',
                background: 'rgba(0, 210, 255, 0.12)',
                color: '#00D2FF',
                border: '1px solid rgba(0, 210, 255, 0.3)',
                borderRadius: '8px',
                fontWeight: '600'
              }}
              title="Autofill Worker Credentials"
            >
              👷 Worker
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('citizen@waste.com');
                setPassword('citizen123');
                navigate('/login?role=citizen');
              }}
              className="btn"
              style={{
                padding: '8px 4px',
                fontSize: '11px',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                fontWeight: '600'
              }}
              title="Autofill Citizen Credentials"
            >
              👤 Citizen
            </button>
          </div>
        </div>

        {/* Portal Quick Switcher (If not Admin) */}
        {role !== 'admin' && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginTop: '20px',
            paddingTop: '14px',
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

      <AnimatePresence>
        {showResetModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}
          >
            <motion.div 
              initial={{ scale: 0.92, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="glass-panel" 
              style={{ width: '100%', maxWidth: '400px', borderColor: 'var(--border-glass)' }}
            >
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>Reset Password</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>
                {resetStep === 1 
                  ? 'Enter your registered email address to receive a 6-digit verification code.'
                  : 'Enter the 6-digit OTP code sent to your email and set your new password.'
                }
              </p>

              {resetError && <div style={{ color: 'var(--color-danger)', background: 'rgba(255,74,90,0.1)', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>{resetError}</div>}
              {resetSuccess && <div style={{ color: 'var(--color-primary)', background: 'rgba(16,185,129,0.1)', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>{resetSuccess}</div>}

              {resetStep === 1 ? (
                <form onSubmit={handleRequestResetOtp}>
                  <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={resetEmail} 
                      onChange={(e) => setResetEmail(e.target.value)} 
                      placeholder="name@example.com"
                      required 
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowResetModal(false)} style={{ flex: 1 }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={resetLoading} style={{ flex: 1 }}>{resetLoading ? 'Sending...' : 'Send OTP'}</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetSubmit}>
                  <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--text-secondary)' }}>6-Digit OTP Code</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={resetOtp} 
                      onChange={(e) => setResetOtp(e.target.value)} 
                      placeholder="123456"
                      maxLength={6}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--text-secondary)' }}>New Password</label>
                    <input 
                      type="password" 
                      className="form-input" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      placeholder="••••••••"
                      required 
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setResetStep(1)} style={{ flex: 1 }}>Back</button>
                    <button type="submit" className="btn btn-primary" disabled={resetLoading} style={{ flex: 1 }}>{resetLoading ? 'Resetting...' : 'Reset Password'}</button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
