import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import { User, Mail, Lock, Save, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const updateData = { name, email };
      if (password) {
        updateData.password = password;
      }

      const { data } = await API.put('/auth/profile', updateData);
      
      // Update global context user details
      setUser(data);
      setSuccess('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px 24px', maxWidth: '500px', margin: '0 auto' }}>
      
      {/* Back button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-glass)',
          borderRadius: '8px',
          padding: '8px',
          cursor: 'pointer',
          color: 'var(--text-secondary)'
        }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '24px', color: 'var(--text-primary)' }}>Profile Settings</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Update your personal credentials and account details.</p>
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

      {success && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '8px',
          padding: '12px',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px'
        }}>
          <CheckCircle size={16} />
          <span>{success}</span>
        </div>
      )}

      <div className="glass-panel">
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ margin: '24px 0', borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Change Password (Optional)
            </h4>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Leave blank to keep current"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '20px', gap: '8px' }}
            disabled={loading}
          >
            <Save size={16} />
            {loading ? 'Saving Changes...' : 'Save Profile'}
          </button>

        </form>
      </div>

    </div>
  );
};

export default Profile;
