import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Trash2, AlertCircle, Award, Shield, Hammer, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState(null); // 'citizen', 'admin', 'worker', or null
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  
  // Google Popup state
  const [showGooglePopup, setShowGooglePopup] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  // Demo credentials mapping
  const demoCredentials = {
    citizen: { email: 'citizen@waste.com', password: 'citizen123' },
    admin: { email: 'admin@waste.com', password: 'admin123' },
    worker: { email: 'worker1@waste.com', password: 'worker123' }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setEmail(demoCredentials[role].email);
    setPassword(demoCredentials[role].password);
    setError('');
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingSubmit(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Handles simulated Google selection
  const handleGoogleSelect = async (name, googleEmail) => {
    setGoogleLoading(true);
    setShowGooglePopup(false);
    setError('');
    
    try {
      await googleLogin(name, googleEmail);
      navigate('/');
    } catch (err) {
      setError(err);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: selectedRole ? '420px' : '900px', transition: 'max-width 0.3s ease-in-out' }}>
        
        {/* Logo and Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            background: 'var(--color-primary)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-neon)',
            marginBottom: '16px'
          }}>
            <Trash2 size={24} color="#000" />
          </div>
          <h2 style={{ fontSize: '28px', color: 'var(--text-primary)' }}>EcoClean Portal</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
            Smart Waste Reporting & Management System
          </p>
        </div>

        {/* State 1: Choose Your Role */}
        {!selectedRole ? (
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', textAlign: 'center', marginBottom: '24px' }}>
              Select your role to access the workspace
            </h3>

            <div className="grid-3" style={{ gap: '20px' }}>
              {/* Citizen Card */}
              <div 
                onClick={() => handleRoleSelect('citizen')}
                className="glass-panel" 
                style={{
                  cursor: 'pointer',
                  border: '1px solid var(--border-glass)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '12px',
                  background: 'rgba(255, 255, 255, 0.01)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-neon)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-glass)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '16px',
                  borderRadius: '12px',
                  color: 'var(--color-primary)'
                }}>
                  <Award size={24} />
                </div>
                <h4 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>Citizen Portal</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Report local waste piles, track cleanup progress, earn Eco-points & claim community badges.
                </p>
              </div>

              {/* Admin Card */}
              <div 
                onClick={() => handleRoleSelect('admin')}
                className="glass-panel" 
                style={{
                  cursor: 'pointer',
                  border: '1px solid var(--border-glass)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '12px',
                  background: 'rgba(255, 255, 255, 0.01)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-secondary)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-neon-blue)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-glass)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  background: 'rgba(0, 210, 255, 0.1)',
                  padding: '16px',
                  borderRadius: '12px',
                  color: 'var(--color-secondary)'
                }}>
                  <Shield size={24} />
                </div>
                <h4 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>Admin Control Panel</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Review reported incidents, visualize waste hotspots on maps, assign cleanups, and track worker stats.
                </p>
              </div>

              {/* Worker Card */}
              <div 
                onClick={() => handleRoleSelect('worker')}
                className="glass-panel" 
                style={{
                  cursor: 'pointer',
                  border: '1px solid var(--border-glass)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '12px',
                  background: 'rgba(255, 255, 255, 0.01)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-warning)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(245, 158, 11, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-glass)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  padding: '16px',
                  borderRadius: '12px',
                  color: 'var(--color-warning)'
                }}>
                  <Hammer size={24} />
                </div>
                <h4 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>Worker Workspace</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Access assigned tasks, navigate cleanup zones using maps, and upload after-cleaning verification photos.
                </p>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '14px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>New Citizen? </span>
              <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}>
                Register here
              </Link>
            </div>
          </div>
        ) : (
          /* State 2: Login form with Pre-filled credentials */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <button 
                type="button" 
                onClick={handleBackToRoles} 
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '6px',
                  padding: '6px',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ArrowLeft size={16} />
              </button>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'capitalize', fontWeight: '600' }}>
                Back to roles ({selectedRole} selected)
              </span>
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

              <div style={{
                margin: '16px 0',
                padding: '10px 14px',
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--color-primary)',
                textAlign: 'center'
              }}>
                ✨ Demo details pre-filled. Click Sign In below.
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '10px' }}
                disabled={loadingSubmit || googleLoading}
              >
                {loadingSubmit ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Google Signup Button (Citizen Only) */}
            {selectedRole === 'citizen' && (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '20px 0',
                  color: 'var(--text-muted)',
                  fontSize: '12px'
                }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }}></div>
                  <span style={{ padding: '0 10px', textTransform: 'uppercase', letterSpacing: '1px' }}>OR</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }}></div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGooglePopup(true)}
                  className="btn btn-secondary"
                  disabled={googleLoading || loadingSubmit}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    borderColor: 'rgba(255, 255, 255, 0.15)'
                  }}
                >
                  {/* Google SVG Logo */}
                  <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: '6px' }}>
                    <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91a8.78 8.78 0 0 0 2.69-6.6z" />
                    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.91-2.26a5.58 5.58 0 0 1-8.52-3v-2.26H.57v2.33A9 9 0 0 0 9 18z" />
                    <path fill="#FBBC05" d="M3.53 10.54a5.4 5.4 0 0 1 0-3.42V4.86H.57a9 9 0 0 0 0 8.32l2.96-2.33z" />
                    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2A9 9 0 0 0 .57 4.86l2.96 2.26a5.4 5.4 0 0 1 5.47-3.54z" />
                  </svg>
                  {googleLoading ? 'Connecting...' : 'Continue with Google'}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Simulated Google OAuth Account Selection Modal */}
      {showGooglePopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 300,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            color: '#1f2937',
            width: '100%',
            maxWidth: '380px',
            borderRadius: '8px',
            padding: '30px 24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            fontFamily: 'Roboto, sans-serif'
          }}>
            {/* Google Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" style={{ marginBottom: '10px' }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09a7.1 7.1 0 0 1 0-4.51V6.74H2.18a11.99 11.99 0 0 0 0 10.51l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#202124' }}>Sign in with Google</h3>
              <p style={{ fontSize: '13px', color: '#5f6368', marginTop: '4px' }}>to continue to <strong>EcoClean</strong></p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              
              {/* Account 1 */}
              <div 
                onClick={() => handleGoogleSelect('Adarsh Nair', 'adarsh.nair.google@gmail.com')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #e8eaed',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  A
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#3c4043' }}>Adarsh Nair</div>
                  <div style={{ fontSize: '12px', color: '#5f6368' }}>adarsh.nair.google@gmail.com</div>
                </div>
              </div>

              {/* Account 2 */}
              <div 
                onClick={() => handleGoogleSelect('Anjali Menon', 'anjali.menon.google@gmail.com')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #e8eaed',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--color-secondary)',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  AM
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#3c4043' }}>Anjali Menon</div>
                  <div style={{ fontSize: '12px', color: '#5f6368' }}>anjali.menon.google@gmail.com</div>
                </div>
              </div>

              {/* Account 3 */}
              <div 
                onClick={() => {
                  const evaluatorName = prompt('Enter your name for Google registration:', 'Evaluator Guest');
                  if (evaluatorName) {
                    handleGoogleSelect(evaluatorName, 'test.evaluator@gmail.com');
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#dadce0',
                  color: '#3c4043',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  👤
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a73e8' }}>Use another account</div>
                  <div style={{ fontSize: '12px', color: '#5f6368' }}>Click to enter custom evaluator details</div>
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', fontSize: '12px', color: '#757575' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => setShowGooglePopup(false)}>Cancel</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ cursor: 'pointer' }}>Help</span>
                <span style={{ cursor: 'pointer' }}>Privacy</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;
