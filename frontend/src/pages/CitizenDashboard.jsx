import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Award, PlusCircle, AlertCircle, Clock, MapPin, CheckCircle2, ChevronRight, Trophy, Megaphone, Calendar } from 'lucide-react';

const CitizenDashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [leaderboard, setLeaderboard] = useState({ citizens: [], workers: [] });
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
        }} className="grid-2">
          
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: idx === 0 ? 'var(--color-warning)' : idx === 1 ? '#9ca3af' : idx === 2 ? '#b45309' : 'var(--text-muted)' }}>
                        #{idx + 1}
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

        {/* Middle Side: Reported List */}
        <div className="glass-panel" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px' }}>
            My Reported Dumps ({complaints.length})
          </h3>

          {complaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed var(--border-glass)', borderRadius: '12px' }}>
              <MapPin size={40} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>You haven\'t reported any waste dumps yet.</p>
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
                          src={complaint.photoBefore.startsWith('http') ? complaint.photoBefore : `http://localhost:5000${complaint.photoBefore}`}
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

    </div>
  );
};

export default CitizenDashboard;
