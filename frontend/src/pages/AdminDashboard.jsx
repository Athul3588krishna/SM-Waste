import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Shield, Users, CheckCircle2, Clock, AlertTriangle, Play, Check, X, Clipboard, ExternalLink, Calendar, Plus, Edit, Trash2, Megaphone, CheckSquare } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('complaints'); // 'complaints', 'staff', 'announcements'
  
  // Data lists
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Table filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Assignment Modal State
  const [assigningComplaint, setAssigningComplaint] = useState(null);
  const [assignedToType, setAssignedToType] = useState('individual'); // 'individual' | 'team'
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [deadlineDays, setDeadlineDays] = useState('1');

  // Verify Cleanup Modal State
  const [verifyingComplaint, setVerifyingComplaint] = useState(null);
  const [bonusAmount, setBonusAmount] = useState('50');

  // Worker Modal State
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [workerName, setWorkerName] = useState('');
  const [workerEmail, setWorkerEmail] = useState('');
  const [workerPassword, setWorkerPassword] = useState('');
  const [editingWorkerId, setEditingWorkerId] = useState(null);

  // Team Modal State
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [editingTeamId, setEditingTeamId] = useState(null);

  // Announcement State
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementTarget, setAnnouncementTarget] = useState('all');
  const [submittingAnnounce, setSubmittingAnnounce] = useState(false);

  // Fetch admin dashboard details
  const fetchAdminData = async () => {
    try {
      const complaintsRes = await API.get('/admin/complaints');
      setComplaints(complaintsRes.data);

      const workersRes = await API.get('/admin/workers');
      setWorkers(workersRes.data);

      const teamsRes = await API.get('/admin/teams');
      setTeams(teamsRes.data);

      const statsRes = await API.get('/admin/stats');
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Update report status (Verify / Reject)
  const handleStatusChange = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this complaint as ${status}?`)) return;
    try {
      await API.put(`/admin/complaints/${id}/status`, { status });
      alert(`Complaint successfully ${status}!`);
      fetchAdminData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Action failed');
    }
  };

  // Submit Assignment (Assign worker or team)
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    const endpoint = assigningComplaint.status === 'assigned' || assigningComplaint.status === 'in_progress'
      ? `/admin/complaints/${assigningComplaint._id}/reassign`
      : `/admin/complaints/${assigningComplaint._id}/assign`;

    const body = {
      assignedToType,
      workerId: assignedToType === 'individual' ? selectedWorkerId : undefined,
      teamId: assignedToType === 'team' ? selectedTeamId : undefined,
      deadlineDays,
    };

    try {
      await API.put(endpoint, body);
      alert('Assignment completed successfully!');
      setAssigningComplaint(null);
      setSelectedWorkerId('');
      setSelectedTeamId('');
      fetchAdminData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Assignment failed');
    }
  };

  // Submit Cleanup Verification
  const handleVerifyCleanup = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/admin/complaints/${verifyingComplaint._id}/verify-cleanup`, {
        bonusAmount,
      });
      alert('Cleanup verified! Eco-points and bonuses have been awarded.');
      setVerifyingComplaint(null);
      setBonusAmount('50');
      fetchAdminData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Verification failed');
    }
  };

  // Create or Update Worker account
  const handleWorkerSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingWorkerId) {
        // Edit Worker
        await API.put(`/admin/workers/${editingWorkerId}`, {
          name: workerName,
          email: workerEmail,
          password: workerPassword || undefined,
        });
        alert('Worker account updated successfully!');
      } else {
        // Create Worker
        await API.post('/admin/workers', {
          name: workerName,
          email: workerEmail,
          password: workerPassword,
        });
        alert('Worker account created successfully!');
      }
      setShowWorkerModal(false);
      setWorkerName('');
      setWorkerEmail('');
      setWorkerPassword('');
      setEditingWorkerId(null);
      fetchAdminData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Action failed');
    }
  };

  // Auto-generate customized worker credentials (email and password) based on name
  const handleAutoGenerateCredentials = () => {
    if (!workerName.trim()) {
      alert('Please enter a Worker Name first to generate credentials.');
      return;
    }
    const cleanName = workerName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '.')
      .replace(/[^a-z0-9.]/g, '');
    
    // Add random suffix to prevent duplicates
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const generatedEmail = `${cleanName}${randomSuffix}@ecoclean.com`;
    
    // Generate secure password excluding ambiguous characters (like 1, l, 0, O)
    const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let generatedPassword = '';
    for (let i = 0; i < 8; i++) {
      generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setWorkerEmail(generatedEmail);
    setWorkerPassword(generatedPassword);
  };

  // Delete worker account
  const handleDeleteWorker = async (id) => {
    if (!window.confirm('Are you sure you want to delete this worker account?')) return;
    try {
      await API.delete(`/admin/workers/${id}`);
      alert('Worker account deleted successfully!');
      fetchAdminData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  // Create or Update Team
  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeamId) {
        // Update Team
        await API.put(`/admin/teams/${editingTeamId}`, {
          name: teamName,
          members: selectedMembers,
        });
        alert('Cleaning team updated successfully!');
      } else {
        // Create Team
        await API.post('/admin/teams', {
          name: teamName,
          members: selectedMembers,
        });
        alert('Cleaning team created successfully!');
      }
      setShowTeamModal(false);
      setTeamName('');
      setSelectedMembers([]);
      setEditingTeamId(null);
      fetchAdminData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Action failed');
    }
  };

  // Delete Cleaning Team
  const handleDeleteTeam = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cleaning team?')) return;
    try {
      await API.delete(`/admin/teams/${id}`);
      alert('Team deleted successfully!');
      fetchAdminData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  // Post Announcement
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    setSubmittingAnnounce(true);
    try {
      await API.post('/admin/announcements', {
        title: announcementTitle,
        content: announcementContent,
        target: announcementTarget,
      });
      alert('Announcement published successfully!');
      setAnnouncementTitle('');
      setAnnouncementContent('');
      setAnnouncementTarget('all');
    } catch (error) {
      console.error(error);
      alert('Failed to publish announcement.');
    } finally {
      setSubmittingAnnounce(false);
    }
  };

  // Toggle member selection in Team Checklist
  const handleMemberToggle = (workerId) => {
    setSelectedMembers((prev) =>
      prev.includes(workerId) ? prev.filter((id) => id !== workerId) : [...prev, workerId]
    );
  };

  // Dynamic SVG Marker based on status
  const getMarkerIcon = (status) => {
    let color = '#f59e0b';
    if (status === 'verified') color = '#00d2ff';
    if (status === 'assigned') color = '#3b82f6';
    if (status === 'in_progress') color = '#a78bfa'; // Purple for In Progress
    if (status === 'cleaned') color = '#34d399'; // Mint Green for Cleaned
    if (status === 'completed') color = '#10b981'; // Green for Verified Completed
    if (status === 'rejected') color = '#ff4a5a';

    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
        <path fill="${color}" stroke="#fff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `;

    return new L.DivIcon({
      html: svgIcon,
      className: 'custom-leaflet-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });
  };

  // Filtering reports list
  const filteredComplaints = complaints.filter((comp) => {
    const matchesSearch = comp.title.toLowerCase().includes(search.toLowerCase()) || 
                          comp.location.address.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || comp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Export filtered complaints list to CSV file (Real Report Generation)
  const exportToCSV = () => {
    const headers = 'Title,Location Address,Latitude,Longitude,Citizen Reporter,Waste Type,Severity,Assigned To Type,Worker/Team,Status,Deadline Date,Bonus Paid ($)\n';
    const rows = filteredComplaints.map((c) => {
      const assigneeName = c.assignedToType === 'individual' ? c.worker?.name : c.assignedToType === 'team' ? c.team?.name : 'Unassigned';
      const deadline = c.deadlineAt ? new Date(c.deadlineAt).toLocaleDateString() : 'N/A';
      return `"${c.title.replace(/"/g, '""')}","${c.location.address.replace(/"/g, '""')}",${c.location.latitude},${c.location.longitude},"${c.citizen?.name || 'Unknown'}","${c.wasteType}","${c.severity}","${c.assignedToType || 'Unassigned'}","${assigneeName || 'N/A'}","${c.status}","${deadline}",${c.bonusAmount}`;
    });
    
    const blob = new Blob([headers + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ecoclean_waste_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Verify if a complaint is overdue
  const isOverdue = (comp) => {
    if (!comp.deadlineAt || ['completed', 'rejected', 'cleaned'].includes(comp.status)) return false;
    return new Date(comp.deadlineAt) < new Date();
  };

  const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading Admin Control Panel...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--color-secondary)', padding: '8px', borderRadius: '8px' }}>
            <Shield size={20} color="#000" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', color: 'var(--text-primary)' }}>Administrative Control Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Monitor city cleanliness reports, manage workers/teams, and post announcements.</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '4px' }}>
          <button onClick={() => setActiveTab('complaints')} className={`btn ${activeTab === 'complaints' ? 'btn-primary' : ''}`} style={{ background: activeTab === 'complaints' ? 'var(--color-primary)' : 'transparent', color: activeTab === 'complaints' ? '#000' : 'var(--text-secondary)', padding: '6px 16px', fontSize: '13px', borderRadius: '6px' }}>
            Incidents Ledger
          </button>
          <button onClick={() => setActiveTab('staff')} className={`btn ${activeTab === 'staff' ? 'btn-primary' : ''}`} style={{ background: activeTab === 'staff' ? 'var(--color-primary)' : 'transparent', color: activeTab === 'staff' ? '#000' : 'var(--text-secondary)', padding: '6px 16px', fontSize: '13px', borderRadius: '6px' }}>
            Staff Manager
          </button>
          <button onClick={() => setActiveTab('announcements')} className={`btn ${activeTab === 'announcements' ? 'btn-primary' : ''}`} style={{ background: activeTab === 'announcements' ? 'var(--color-primary)' : 'transparent', color: activeTab === 'announcements' ? '#000' : 'var(--text-secondary)', padding: '6px 16px', fontSize: '13px', borderRadius: '6px' }}>
            Broadcaster
          </button>
        </div>
      </div>

      {/* Tab 1: COMPLAINTS LEDGER */}
      {activeTab === 'complaints' && (
        <div>
          {/* Metrics Cards */}
          <div className="grid-3" style={{ marginBottom: '30px', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
            <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px', color: 'var(--text-primary)' }}>
                <Clipboard size={20} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total reports</div>
                <div style={{ fontSize: '20px', fontWeight: '800' }}>{stats?.totalComplaints || 0}</div>
              </div>
            </div>

            <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '10px', borderRadius: '10px', color: 'var(--color-warning)' }}>
                <Clock size={20} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Pending Review</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-warning)' }}>{stats?.statusCounts?.pending || 0}</div>
              </div>
            </div>

            <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
              <div style={{ background: 'rgba(167, 139, 250, 0.1)', padding: '10px', borderRadius: '10px', color: '#c084fc' }}>
                <Play size={20} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>In Progress</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#c084fc' }}>{stats?.statusCounts?.in_progress || 0}</div>
              </div>
            </div>

            <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
              <div style={{ background: 'rgba(52, 211, 153, 0.1)', padding: '10px', borderRadius: '10px', color: '#34d399' }}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Awaiting Verification</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#34d399' }}>{stats?.statusCounts?.cleaned || 0}</div>
              </div>
            </div>

            <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '10px', color: 'var(--color-primary)' }}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Completed</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-primary)' }}>{stats?.statusCounts?.completed || 0}</div>
              </div>
            </div>
          </div>

          {/* Map Overview Zone */}
          <div className="glass-panel" style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '16px' }}>Incident Placement Map</h3>
            <div className="map-container" style={{ height: '350px' }}>
              <MapContainer center={[9.9816, 76.2999]} zoom={11} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {complaints.map((comp) => (
                  <Marker key={comp._id} position={[comp.location.latitude, comp.location.longitude]} icon={getMarkerIcon(comp.status)}>
                    <Popup>
                      <div style={{ minWidth: '150px' }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '700' }}>{comp.title}</h4>
                        <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#9ca3af' }}>{comp.location.address}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}>{comp.status.replace('_', ' ')}</span>
                          <Link to={`/complaint/${comp._id}`} style={{ fontSize: '10px', color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: 'bold' }}>
                            View Detail
                          </Link>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Table Operations */}
          <div className="glass-panel">
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>Incidents Operations Ledger</h3>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={exportToCSV}
                  className="btn btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '13px', borderRadius: '8px' }}
                >
                  Generate Report (CSV)
                </button>
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="form-input"
                  style={{ width: '220px', padding: '8px 12px', fontSize: '14px' }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <select
                  className="form-input"
                  style={{ width: '160px', padding: '8px 12px', fontSize: '14px' }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="cleaned">Awaiting Verify</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textTransform: 'none', textAlign: 'left', minWidth: '950px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Report details</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Citizen</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Assignee</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Deadline</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '14px' }}>
                        No reports match filters.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((comp) => {
                      const isCompOverdue = isOverdue(comp);
                      return (
                        <tr key={comp._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.01)' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-glass)', background: '#090d16' }}>
                                <img src={comp.photoBefore.startsWith('http') ? comp.photoBefore : `http://localhost:5000${comp.photoBefore}`} alt="waste" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{comp.title}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{comp.location.address.slice(0, 35)}...</div>
                              </div>
                            </div>
                          </td>

                          <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                            {comp.citizen?.name}
                          </td>

                          <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                            {comp.assignedToType === 'individual' && comp.worker && (
                              <div>👷 {comp.worker.name} (Ind.)</div>
                            )}
                            {comp.assignedToType === 'team' && comp.team && (
                              <div>👥 {comp.team.name} (Team)</div>
                            )}
                            {!comp.assignedToType && <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Unassigned</span>}
                          </td>

                          <td style={{ padding: '14px 16px', fontSize: '13px' }}>
                            {comp.deadlineAt ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isCompOverdue ? 'var(--color-danger)' : 'var(--text-secondary)' }}>
                                <Calendar size={13} />
                                {new Date(comp.deadlineAt).toLocaleDateString()}
                                {isCompOverdue && (
                                  <span style={{ fontSize: '9px', background: 'rgba(255, 74, 90, 0.15)', color: 'var(--color-danger)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', animation: 'pulse-glow 1s infinite' }}>
                                    OVERDUE
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>-</span>
                            )}
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            <span className={`badge-status ${getBadgeClass(comp.status)}`} style={{ fontSize: '10px' }}>
                              {comp.status.replace('_', ' ')}
                            </span>
                          </td>

                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                              {/* 1. Pending Approvals */}
                              {comp.status === 'pending' && (
                                <>
                                  <button onClick={() => handleStatusChange(comp._id, 'verified')} className="btn btn-primary" style={{ padding: '6px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-primary)' }} title="Verify Report">
                                    <Check size={13} />
                                  </button>
                                  <button onClick={() => handleStatusChange(comp._id, 'rejected')} className="btn btn-danger" style={{ padding: '6px', borderRadius: '6px', background: 'rgba(255, 74, 90, 0.1)', color: 'var(--color-danger)' }} title="Reject Report">
                                    <X size={13} />
                                  </button>
                                </>
                              )}

                              {/* 2. Verification Cleanup Awaiting */}
                              {comp.status === 'cleaned' && (
                                <button onClick={() => setVerifyingComplaint(comp)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-primary)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                  Verify Cleanup
                                </button>
                              )}

                              {/* 3. Assign or Reassign Overdue */}
                              {(comp.status === 'verified' || isCompOverdue) && (
                                <button onClick={() => {
                                  setAssigningComplaint(comp);
                                  setAssignedToType('individual');
                                  setSelectedWorkerId('');
                                  setSelectedTeamId('');
                                }} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px', color: isCompOverdue ? 'var(--color-danger)' : 'var(--color-primary)', borderColor: isCompOverdue ? 'var(--color-danger)' : 'var(--color-primary)' }}>
                                  {isCompOverdue ? 'Reassign' : 'Assign'}
                                </button>
                              )}

                              <Link to={`/complaint/${comp._id}`} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '11px', borderRadius: '6px' }}>
                                View
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: STAFF MANAGER WORKSPACE */}
      {activeTab === 'staff' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }} className="grid-2">
          
          {/* Workers CRUD Manager */}
          <div className="glass-panel">
            <div className="flex-between" style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={18} /> Workers Directory
              </h3>
              <button onClick={() => {
                setEditingWorkerId(null);
                setWorkerName('');
                setWorkerEmail('');
                setWorkerPassword('');
                setShowWorkerModal(true);
              }} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}>
                <Plus size={14} /> Add Worker
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <th style={{ padding: '10px', color: 'var(--text-secondary)' }}>Worker Name</th>
                    <th style={{ padding: '10px', color: 'var(--text-secondary)' }}>Email</th>
                    <th style={{ padding: '10px', color: 'var(--text-secondary)' }}>Team</th>
                    <th style={{ padding: '10px', color: 'var(--text-secondary)' }}>Status</th>
                    <th style={{ padding: '10px', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No workers registered.</td>
                    </tr>
                  ) : (
                    workers.map((w) => (
                      <tr key={w._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.01)' }}>
                        <td style={{ padding: '10px', color: 'var(--text-primary)', fontWeight: '500' }}>{w.name}</td>
                        <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{w.email}</td>
                        <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{w.team ? w.team.name : 'None'}</td>
                        <td style={{ padding: '10px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            color: w.isOnline ? 'var(--color-primary)' : 'var(--text-muted)'
                          }}>
                            <span style={{ width: '6px', height: '6px', background: w.isOnline ? 'var(--color-primary)' : 'var(--text-muted)', borderRadius: '50%' }}></span>
                            {w.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </td>
                        <td style={{ padding: '10px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button onClick={() => {
                              setEditingWorkerId(w._id);
                              setWorkerName(w.name);
                              setWorkerEmail(w.email);
                              setWorkerPassword('');
                              setShowWorkerModal(true);
                            }} className="btn btn-secondary" style={{ padding: '6px' }} title="Edit">
                              <Edit size={12} />
                            </button>
                            <button onClick={() => handleDeleteWorker(w._id)} className="btn btn-danger" style={{ padding: '6px', background: 'rgba(255,74,90,0.1)' }} title="Delete">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Teams CRUD Manager */}
          <div className="glass-panel">
            <div className="flex-between" style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clipboard size={18} /> Cleaning Teams
              </h3>
              <button onClick={() => {
                setEditingTeamId(null);
                setTeamName('');
                setSelectedMembers([]);
                setShowTeamModal(true);
              }} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}>
                <Plus size={14} /> Create Team
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <th style={{ padding: '10px', color: 'var(--text-secondary)' }}>Team Name</th>
                    <th style={{ padding: '10px', color: 'var(--text-secondary)' }}>Members count</th>
                    <th style={{ padding: '10px', color: 'var(--text-secondary)' }}>Team Members</th>
                    <th style={{ padding: '10px', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No teams formed.</td>
                    </tr>
                  ) : (
                    teams.map((t) => (
                      <tr key={t._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.01)' }}>
                        <td style={{ padding: '10px', color: 'var(--text-primary)', fontWeight: '500' }}>{t.name}</td>
                        <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{t.members?.length || 0} members</td>
                        <td style={{ padding: '10px', color: 'var(--text-muted)', fontSize: '12px' }}>
                          {t.members?.map(m => m.name).join(', ')}
                        </td>
                        <td style={{ padding: '10px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button onClick={() => {
                              setEditingTeamId(t._id);
                              setTeamName(t.name);
                              setSelectedMembers(t.members.map(m => m._id));
                              setShowTeamModal(true);
                            }} className="btn btn-secondary" style={{ padding: '6px' }} title="Edit Team">
                              <Edit size={12} />
                            </button>
                            <button onClick={() => handleDeleteTeam(t._id)} className="btn btn-danger" style={{ padding: '6px', background: 'rgba(255,74,90,0.1)' }} title="Delete Team">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: ANNOUNCEMENTS BROADCASTER */}
      {activeTab === 'announcements' && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="glass-panel">
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Megaphone size={20} color="var(--color-primary)" /> Publish Municipal Bulletin
            </h3>

            <form onSubmit={handleAnnouncementSubmit}>
              <div className="form-group">
                <label className="form-label">Bulletin Title</label>
                <input
                  type="text"
                  placeholder="e.g., Heavy Rain Cleanup Protocol"
                  className="form-input"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Announcement Target Audience</label>
                <select
                  className="form-input"
                  value={announcementTarget}
                  onChange={(e) => setAnnouncementTarget(e.target.value)}
                >
                  <option value="all">Everyone (Citizens & Workers)</option>
                  <option value="citizens">Citizens Only</option>
                  <option value="workers">Workers Only</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message Details</label>
                <textarea
                  className="form-input"
                  placeholder="Type the announcement bulletin content details here..."
                  value={announcementContent}
                  onChange={(e) => setAnnouncementContent(e.target.value)}
                  rows="5"
                  style={{ resize: 'none' }}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={submittingAnnounce}>
                {submittingAnnounce ? 'Publishing...' : 'Publish Announcement'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TASK ASSIGNMENT */}
      {assigningComplaint && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '420px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px' }}>
              Assign: "{assigningComplaint.title}"
            </h3>

            <form onSubmit={handleAssignSubmit}>
              <div className="form-group">
                <label className="form-label">Assign To</label>
                <select className="form-input" value={assignedToType} onChange={(e) => setAssignedToType(e.target.value)}>
                  <option value="individual">Sanitation Worker (Online Only)</option>
                  <option value="team">Cleaning Team</option>
                </select>
              </div>

              {assignedToType === 'individual' ? (
                <div className="form-group">
                  <label className="form-label">Select Online Worker</label>
                  <select className="form-input" value={selectedWorkerId} onChange={(e) => setSelectedWorkerId(e.target.value)} required>
                    <option value="">Choose Online Worker</option>
                    {workers.filter(w => w.isOnline).map((w) => (
                      <option key={w._id} value={w._id}>{w.name} (Online)</option>
                    ))}
                  </select>
                  {workers.filter(w => w.isOnline).length === 0 && (
                    <div style={{ fontSize: '11px', color: 'var(--color-danger)', marginTop: '4px' }}>
                      ⚠️ No workers are currently online. Toggle worker online or assign to a Team.
                    </div>
                  )}
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Select Cleaning Team</label>
                  <select className="form-input" value={selectedTeamId} onChange={(e) => setSelectedTeamId(e.target.value)} required>
                    <option value="">Choose Cleaning Team</option>
                    {teams.map((t) => (
                      <option key={t._id} value={t._id}>{t.name} ({t.members?.length || 0} members)</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Mandatory Deadline</label>
                <select className="form-input" value={deadlineDays} onChange={(e) => setDeadlineDays(e.target.value)}>
                  <option value="1">1 Day Completion</option>
                  <option value="2">2 Days Completion</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setAssigningComplaint(null)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={assignedToType === 'individual' && workers.filter(w => w.isOnline).length === 0}>
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VERIFY CLEANUP & AWARD BONUS */}
      {verifyingComplaint && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '450px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px' }}>Verify Resolved Cleanup</h3>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>BEFORE</div>
                <img src={verifyingComplaint.photoBefore.startsWith('http') ? verifyingComplaint.photoBefore : `http://localhost:5000${verifyingComplaint.photoBefore}`} alt="before" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-primary)' }}>AFTER</div>
                <img src={verifyingComplaint.photoAfter.startsWith('http') ? verifyingComplaint.photoAfter : `http://localhost:5000${verifyingComplaint.photoAfter}`} alt="after" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-primary)' }} />
              </div>
            </div>

            <form onSubmit={handleVerifyCleanup}>
              <div className="form-group">
                <label className="form-label">Award Performance Bonus (Dummy $)</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(e.target.value)}
                  required
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Awarded to worker <strong>{verifyingComplaint.worker?.name}</strong> as a dummy cleanup payout.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setVerifyingComplaint(null)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm & Verify Resolution</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: WORKER CRUD */}
      {showWorkerModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '380px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px' }}>
              {editingWorkerId ? 'Edit Worker Account' : 'Register New Worker'}
            </h3>

            <form onSubmit={handleWorkerSubmit}>
              <div className="form-group" style={{ marginBottom: '8px' }}>
                <label className="form-label">Worker Name</label>
                <input
                  type="text"
                  placeholder="Anil Kumar"
                  className="form-input"
                  value={workerName}
                  onChange={(e) => setWorkerName(e.target.value)}
                  required
                />
              </div>

              {!editingWorkerId && (
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={handleAutoGenerateCredentials}
                    style={{
                      background: 'rgba(0, 210, 255, 0.1)',
                      border: '1px solid rgba(0, 210, 255, 0.3)',
                      color: 'var(--color-secondary)',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(0, 210, 255, 0.2)';
                      e.target.style.borderColor = 'var(--color-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(0, 210, 255, 0.1)';
                      e.target.style.borderColor = 'rgba(0, 210, 255, 0.3)';
                    }}
                  >
                    ⚡ Auto-Generate Login info
                  </button>
                </div>
              )}

              {/* Show Copyable Credentials Box when generated */}
              {!editingWorkerId && workerPassword && (
                <div style={{
                  background: 'rgba(0, 210, 255, 0.05)',
                  border: '1px solid rgba(0, 210, 255, 0.2)',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  marginBottom: '16px',
                  fontFamily: 'monospace',
                  color: 'var(--text-primary)'
                }}>
                  <div style={{ color: 'var(--color-secondary)', marginBottom: '6px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Generated Credentials (Copy & share with worker):
                  </div>
                  <div><strong>Email:</strong> {workerEmail}</div>
                  <div><strong>Password:</strong> {workerPassword}</div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address (Username)</label>
                <input
                  type="email"
                  placeholder="worker@ecoclean.com"
                  className="form-input"
                  value={workerEmail}
                  onChange={(e) => setWorkerEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password {editingWorkerId && '(Leave blank to keep current)'}</label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  className="form-input"
                  value={workerPassword}
                  onChange={(e) => setWorkerPassword(e.target.value)}
                  required={!editingWorkerId}
                  minLength={6}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowWorkerModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">{editingWorkerId ? 'Save Worker' : 'Create Worker'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TEAM CRUD */}
      {showTeamModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px' }}>
              {editingTeamId ? 'Edit Cleaning Team' : 'Construct Cleaning Team'}
            </h3>

            <form onSubmit={handleTeamSubmit}>
              <div className="form-group">
                <label className="form-label">Team Name</label>
                <input
                  type="text"
                  placeholder="e.g., Kochi East Squad"
                  className="form-input"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Select Workers for Team</label>
                <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {workers.length === 0 ? (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No workers registered yet.</span>
                  ) : (
                    workers.map((w) => (
                      <label key={w._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(w._id)}
                          onChange={() => handleMemberToggle(w._id)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ color: 'var(--text-primary)' }}>{w.name} ({w.email})</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowTeamModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">{editingTeamId ? 'Save Team' : 'Create Team'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
