import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import { Trash2, LogOut, Award, Shield, Hammer, Bell, User, Check } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    try {
      if (!user) return;
      const { data } = await API.get('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll notifications every 30 seconds for live updates
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return (
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(11, 13, 19, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-glass)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'var(--color-primary)',
            padding: '6px',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-neon)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Trash2 size={18} color="#000" />
          </div>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' }} className="text-gradient">
              EcoClean
            </span>
          </Link>
        </div>

        {/* Navigation Links for Guest */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>
            Home
          </Link>
          <a href="#leaderboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }} onClick={(e) => {
            e.preventDefault();
            const el = document.querySelector('.glass-panel');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}>
            Leaderboard
          </a>
        </div>

        {/* Guest Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/login?role=citizen" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}>
            Citizen Portal
          </Link>
          <Link to="/login?role=worker" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
            Worker Access
          </Link>
        </div>
      </nav>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(11, 13, 19, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-glass)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          background: 'var(--color-primary)',
          padding: '6px',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-neon)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Trash2 size={18} color="#000" />
        </div>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' }} className="text-gradient">
            EcoClean
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {user.role === 'citizen' && (
          <>
            <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>
              Dashboard
            </Link>
            <Link to="/report" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>
              Report Waste
            </Link>
          </>
        )}

        {user.role === 'admin' && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-secondary)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>
            <Shield size={13} /> Admin Portal
          </span>
        )}

        {user.role === 'worker' && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-secondary)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>
            <Hammer size={13} /> Sanitation Worker
          </span>
        )}
      </div>

      {/* Profile & Notifications Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user.role === 'citizen' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-glass)',
            padding: '4px 10px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px'
          }}>
            <Award size={14} color="var(--color-primary)" />
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{user.points} pts</span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: '8px' }}>
              {user.badge}
            </span>
          </div>
        )}

        {/* Notifications Icon with Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-glass)',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              color: unreadCount > 0 ? 'var(--color-primary)' : 'var(--text-secondary)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--color-primary)',
                color: '#000',
                fontSize: '9px',
                fontWeight: '700',
                borderRadius: '50%',
                width: '14px',
                height: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-neon)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showDropdown && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '40px',
              width: '320px',
              background: '#111622',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-glass)',
              zIndex: 200,
              overflow: 'hidden'
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '700' }}>In-App Notifications</span>
                {unreadCount > 0 && <span style={{ fontSize: '10px', color: 'var(--color-primary)' }}>{unreadCount} new</span>}
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => !n.isRead && handleMarkAsRead(n._id)}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid rgba(255,255,255,0.02)',
                        background: n.isRead ? 'transparent' : 'rgba(16, 185, 129, 0.03)',
                        cursor: n.isRead ? 'default' : 'pointer',
                        transition: 'background 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: n.isRead ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                          {n.title}
                        </span>
                        {!n.isRead && <span style={{ width: '6px', height: '6px', background: 'var(--color-primary)', borderRadius: '50%', flexShrink: 0, marginTop: '4px' }}></span>}
                      </div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile and logout actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ textAlign: 'right' }}>
            <Link to="/profile" style={{ textDecoration: 'none' }} title="Edit Profile">
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {user.name} <User size={12} color="var(--text-muted)" />
              </div>
            </Link>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              {user.role}
            </div>
          </div>

          <button onClick={handleLogout} style={{
            background: 'rgba(255, 74, 90, 0.1)',
            border: '1px solid rgba(255, 74, 90, 0.2)',
            padding: '6px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--color-danger)',
            transition: 'all 0.2s'
          }} title="Log Out">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
