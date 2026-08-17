import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { 
  Trash2, LogOut, Award, Shield, Hammer, Bell, User, CheckCheck, 
  Volume2, VolumeX, Radio, ExternalLink, X 
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { 
    isConnected, 
    notifications, 
    toasts, 
    removeToast, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications,
    soundEnabled,
    setSoundEnabled,
    desktopNotifEnabled,
    setDesktopNotifEnabled
  } = useSocket();

  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    setShowDropdown(false);
    // If complaintId or details exist, navigate to detail page
    if (notification.complaint || notification.complaintId) {
      const cId = notification.complaint || notification.complaintId;
      navigate(`/complaint/${cId}`);
    }
  };

  if (!user) {
    return (
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--nav-bg)',
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
          <ThemeToggle />
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

  const unreadCount = Array.isArray(notifications) ? notifications.filter((n) => !n.isRead).length : 0;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-glass)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Brand Logo & Connection Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

        {/* Live Socket Connection Status Badge */}
        <div 
          title={isConnected ? 'Real-Time Socket Connected' : 'Socket Reconnecting...'} 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 8px',
            borderRadius: '12px',
            background: isConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            fontSize: '10px',
            fontWeight: '700',
            color: isConnected ? '#10b981' : '#ef4444',
            letterSpacing: '0.5px'
          }}
        >
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: isConnected ? '#10b981' : '#ef4444',
            boxShadow: isConnected ? '0 0 8px #10b981' : 'none',
            display: 'inline-block'
          }}></span>
          <span>{isConnected ? 'LIVE' : 'OFFLINE'}</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {user.role === 'citizen' && (
          <>
            <Link to="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>
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
        <ThemeToggle />

        {user.role === 'citizen' && (
          <div style={{
            background: 'var(--badge-bg)',
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

        {/* Notifications Icon with Interactive Drawer */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              background: 'var(--badge-bg)',
              border: '1px solid var(--border-glass)',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              color: unreadCount > 0 ? 'var(--color-primary)' : 'var(--text-secondary)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s'
            }}
            title="Notifications"
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
                width: '15px',
                height: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-neon)'
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showDropdown && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '44px',
              width: '350px',
              background: 'var(--modal-bg)',
              border: '1px solid var(--border-glass)',
              borderRadius: '14px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              zIndex: 200,
              overflow: 'hidden',
              backdropFilter: 'blur(20px)'
            }}>
              {/* Drawer Header & Tools */}
              <div style={{ 
                padding: '12px 16px', 
                borderBottom: '1px solid var(--border-glass)', 
                display: 'flex', 
                justify: 'space-between', 
                alignItems: 'center',
                background: 'rgba(255,255,255,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    Real-Time Activity
                  </span>
                  {unreadCount > 0 && (
                    <span style={{ 
                      fontSize: '10px', 
                      background: 'rgba(16, 185, 129, 0.2)', 
                      color: 'var(--color-primary)',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontWeight: '700'
                    }}>
                      {unreadCount} unread
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {/* Mute/Unmute Audio Toggle */}
                  <button 
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    title={soundEnabled ? 'Mute Notification Sounds' : 'Unmute Notification Sounds'}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: soundEnabled ? 'var(--color-primary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px',
                      display: 'flex'
                    }}
                  >
                    {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                  </button>

                  {/* Mark All Read */}
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      title="Mark all as read"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '4px',
                        display: 'flex'
                      }}
                    >
                      <CheckCheck size={15} />
                    </button>
                  )}

                  {/* Clear All */}
                  {notifications.length > 0 && (
                    <button 
                      onClick={clearNotifications}
                      title="Clear all notifications"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '4px',
                        display: 'flex'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Notification List */}
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {(!Array.isArray(notifications) || notifications.length === 0) ? (
                  <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    <Bell size={24} style={{ opacity: 0.3, marginBottom: '8px' }} />
                    <p style={{ margin: 0 }}>No status notifications yet.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => handleNotificationClick(n)}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        background: n.isRead ? 'transparent' : 'rgba(16, 185, 129, 0.04)',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ 
                          fontSize: '12px', 
                          fontWeight: n.isRead ? '600' : '700', 
                          color: n.isRead ? 'var(--text-secondary)' : 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {!n.isRead && (
                            <span style={{ 
                              width: '6px', 
                              height: '6px', 
                              background: 'var(--color-primary)', 
                              borderRadius: '50%', 
                              display: 'inline-block' 
                            }} />
                          )}
                          {n.title}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {formatTimeAgo(n.createdAt)}
                        </span>
                      </div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4', margin: '4px 0 0 0' }}>
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile and Logout */}
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

      {/* Floating Stacked Toast Notifications */}
      {toasts && toasts.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: '10px',
          pointerEvents: 'none'
        }}>
          {toasts.map((toast) => {
            const isSuccess = toast.type === 'success';
            const isWarning = toast.type === 'warning';
            const isAnnouncement = toast.type === 'announcement';

            const borderColor = isSuccess ? '#10b981' : isWarning ? '#f59e0b' : isAnnouncement ? '#8b5cf6' : 'var(--color-primary)';
            const shadowColor = isSuccess ? 'rgba(16, 185, 129, 0.25)' : isWarning ? 'rgba(245, 158, 11, 0.25)' : 'rgba(139, 92, 246, 0.25)';

            return (
              <div
                key={toast.id}
                onClick={() => {
                  if (toast.complaintId) {
                    navigate(`/complaint/${toast.complaintId}`);
                    removeToast(toast.id);
                  }
                }}
                style={{
                  pointerEvents: 'auto',
                  background: 'rgba(10, 14, 23, 0.96)',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '12px',
                  padding: '14px 16px',
                  boxShadow: `0 8px 30px ${shadowColor}`,
                  width: '320px',
                  backdropFilter: 'blur(16px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  cursor: toast.complaintId ? 'pointer' : 'default',
                  transition: 'transform 0.2s ease, opacity 0.2s ease',
                  animation: 'slideInToast 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: borderColor, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {toast.title}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeToast(toast.id);
                    }} 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--text-secondary)', 
                      cursor: 'pointer', 
                      padding: '2px'
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>

                <p style={{ fontSize: '11px', color: 'var(--text-primary)', margin: 0, lineHeight: '1.4' }}>
                  {toast.message}
                </p>

                {toast.complaintId && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: borderColor, fontWeight: '700', marginTop: '2px' }}>
                    <span>View details</span> <ExternalLink size={10} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes slideInToast {
          from { transform: translateY(50px) scale(0.92); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
