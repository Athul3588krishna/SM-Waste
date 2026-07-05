import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Trash2, LogOut, Award, Shield, Hammer } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(11, 13, 19, 0.75)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-glass)',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'between'
    }} className="flex-between">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          background: 'var(--color-primary)',
          padding: '8px',
          borderRadius: '10px',
          boxShadow: 'var(--shadow-neon)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Trash2 size={20} color="#000" />
        </div>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }} className="text-gradient">
            EcoClean
          </span>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {user.role === 'citizen' && (
          <>
            <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500', fontSize: '15px' }}>
              Dashboard
            </Link>
            <Link to="/report" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500', fontSize: '15px' }}>
              Report Waste
            </Link>
          </>
        )}

        {user.role === 'admin' && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-secondary)', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>
            <Shield size={14} /> Admin Portal
          </span>
        )}

        {user.role === 'worker' && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-secondary)', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>
            <Hammer size={14} /> Sanitation Worker
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user.role === 'citizen' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-glass)',
            padding: '6px 12px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Award size={16} color="var(--color-primary)" />
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {user.points} pts
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '10px' }}>
              {user.badge}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              {user.role}
            </div>
          </div>

          <button onClick={handleLogout} style={{
            background: 'rgba(255, 74, 90, 0.1)',
            border: '1px solid rgba(255, 74, 90, 0.2)',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--color-danger)',
            transition: 'all 0.2s'
          }} title="Log Out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
