import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingSubmit(true);

    try {
      await API.post('/auth/register', { name, email, password });
      alert('Thank you for registering. Please log in using your credentials.');
      navigate('/login?role=citizen');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoadingSubmit(false);
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
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px' }}>
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
            <UserPlus size={24} color="#000" />
          </div>
          <h2 style={{ fontSize: '28px', color: 'var(--text-primary)' }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
            Join the community to keep our spaces clean
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
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Adarsh Nair"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loadingSubmit}
          >
            {loadingSubmit ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
