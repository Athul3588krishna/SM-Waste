import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Shield, Users, CheckCircle2, Clock, AlertTriangle, Play, Check, X, Clipboard, ExternalLink } from 'lucide-react';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Table filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Assignment states
  const [assigningId, setAssigningId] = useState(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');

  // Fetch admin dashboard details
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const complaintsRes = await API.get('/admin/complaints');
      setComplaints(complaintsRes.data);

      const workersRes = await API.get('/admin/workers');
      setWorkers(workersRes.data);

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

  // Update complaint status (Verify / Reject)
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

  // Assign complaint to worker
  const handleAssign = async (e, id) => {
    e.preventDefault();
    if (!selectedWorkerId) return;

    try {
      await API.put(`/admin/complaints/${id}/assign`, { workerId: selectedWorkerId });
      alert('Sanitation worker assigned successfully!');
      setAssigningId(null);
      setSelectedWorkerId('');
      fetchAdminData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Assignment failed');
    }
  };

  // Dynamic SVG Marker based on status
  const getMarkerIcon = (status) => {
    let color = '#f59e0b'; // Amber for pending
    if (status === 'verified') color = '#00d2ff'; // Cyan
    if (status === 'assigned') color = '#3b82f6'; // Blue
    if (status === 'completed') color = '#10b981'; // Green
    if (status === 'rejected') color = '#ff4a5a'; // Red

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

  // Chart Styling Constants
  const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--color-secondary)', padding: '8px', borderRadius: '8px' }}>
          <Shield size={20} color="#000" />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', color: 'var(--text-primary)' }}>Administrative Control Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Monitor city cleanliness reports, assign workers, and view hot zones.</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid-3" style={{ marginBottom: '30px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', color: 'var(--text-primary)' }}>
            <Clipboard size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total Incidents</div>
            <div style={{ fontSize: '24px', fontWeight: '800' }}>{stats?.totalComplaints || 0}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--color-warning)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Pending Review</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-warning)' }}>
              {stats?.statusCounts?.pending || 0}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '12px', color: '#60a5fa' }}>
            <Play size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Active Tasks</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#60a5fa' }}>
              {(stats?.statusCounts?.verified || 0) + (stats?.statusCounts?.assigned || 0)}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--color-primary)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Resolved Cases</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-primary)' }}>
              {stats?.statusCounts?.completed || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Main interactive map and visual analytics */}
      <div className="grid-3-1" style={{ gap: '30px', marginBottom: '30px' }}>
        
        {/* Map Zone */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', minHeight: '450px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px' }}>Waste Hotspots Map</h3>
          
          <div className="map-container" style={{ flex: 1, minHeight: '380px' }}>
            <MapContainer center={[9.9816, 76.2999]} zoom={11} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {complaints.map((comp) => (
                <Marker key={comp._id} position={[comp.location.latitude, comp.location.longitude]} icon={getMarkerIcon(comp.status)}>
                  <Popup>
                    <div style={{ minWidth: '160px' }}>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '700' }}>{comp.title}</h4>
                      <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#9ca3af' }}>{comp.location.address}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold' }}>{comp.status}</span>
                        <Link to={`/complaint/${comp._id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '11px', color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: 'bold' }}>
                          View Details <ExternalLink size={10} />
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Recharts Pie: Category distribution */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '12px', textAlign: 'center' }}>Waste Category Distribution</h3>
          
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.wasteTypeDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats?.wasteTypeDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#111827', borderColor: 'var(--border-glass)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 12px', justifyContent: 'center', fontSize: '12px' }}>
            {(stats?.wasteTypeDistribution || []).map((entry, idx) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', background: PIE_COLORS[idx % PIE_COLORS.length], borderRadius: '50%' }}></span>
                <span style={{ color: 'var(--text-secondary)' }}>{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Analytics Part 2: Monthly Trends & Worker Performance */}
      <div className="grid-2" style={{ gap: '30px', marginBottom: '30px' }}>
        
        {/* Line Chart: Reports Trend */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px' }}>Report Ingestion Trends</h3>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.monthlyTrends || []}>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: '#111827', borderColor: 'var(--border-glass)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="count" name="Reports" stroke="var(--color-secondary)" strokeWidth={2.5} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Worker performance */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px' }}>Sanitation Worker Rankings</h3>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.workerPerformance || []}>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: '#111827', borderColor: 'var(--border-glass)', borderRadius: '8px' }} />
                <Bar dataKey="completedCount" name="Cleanups Completed" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Operations management list */}
      <div className="glass-panel">
        
        {/* Table Filters */}
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>Incident Operations Ledger</h3>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search reports or locations..."
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
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Report details</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Citizen</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Type / Severity</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Worker Assigned</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '14px' }}>
                    No reports match the current filters.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((comp) => (
                  <tr key={comp._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                    
                    {/* Title & Info */}
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-glass)', background: '#090d16' }}>
                          <img src={comp.photoBefore.startsWith('http') ? comp.photoBefore : `http://localhost:5000${comp.photoBefore}`} alt="dump" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>{comp.title}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{comp.location.address.slice(0, 35)}...</div>
                        </div>
                      </div>
                    </td>

                    {/* Citizen reporter */}
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      <div>{comp.citizen?.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{comp.citizen?.badge}</div>
                    </td>

                    {/* Type & Severity */}
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.03)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-primary)', marginRight: '6px' }}>
                        {comp.wasteType}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: comp.severity === 'High' ? 'var(--color-danger)' : comp.severity === 'Medium' ? 'var(--color-warning)' : 'var(--color-primary)'
                      }}>
                        {comp.severity}
                      </span>
                    </td>

                    {/* Worker assignment */}
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {comp.worker ? (
                        <div>👷 {comp.worker.name}</div>
                      ) : comp.status === 'verified' ? (
                        assigningId === comp._id ? (
                          <form onSubmit={(e) => handleAssign(e, comp._id)} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <select
                              value={selectedWorkerId}
                              onChange={(e) => setSelectedWorkerId(e.target.value)}
                              className="form-input"
                              style={{ width: '130px', padding: '4px 8px', fontSize: '12px' }}
                              required
                            >
                              <option value="">Choose Worker</option>
                              {workers.map((w) => (
                                <option key={w._id} value={w._id}>{w.name}</option>
                              ))}
                            </select>
                            <button type="submit" className="btn btn-primary" style={{ padding: '6px 8px', borderRadius: '4px', fontSize: '11px' }}>
                              Go
                            </button>
                            <button type="button" onClick={() => setAssigningId(null)} className="btn btn-secondary" style={{ padding: '6px 8px', borderRadius: '4px', fontSize: '11px' }}>
                              Cancel
                            </button>
                          </form>
                        ) : (
                          <button
                            onClick={() => {
                              setAssigningId(comp._id);
                              setSelectedWorkerId('');
                            }}
                            className="btn btn-outline"
                            style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '6px' }}
                          >
                            Assign Worker
                          </button>
                        )
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Not ready (Pending)</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '16px' }}>
                      <span className={`badge-status ${getBadgeClass(comp.status)}`}>
                        {comp.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        {comp.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(comp._id, 'verified')}
                              className="btn btn-primary"
                              style={{ padding: '6px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-primary)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                              title="Verify Report"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(comp._id, 'rejected')}
                              className="btn btn-danger"
                              style={{ padding: '6px', borderRadius: '6px', background: 'rgba(255, 74, 90, 0.1)', color: 'var(--color-danger)', border: '1px solid rgba(255, 74, 90, 0.2)' }}
                              title="Reject Report"
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                        <Link
                          to={`/complaint/${comp._id}`}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
                        >
                          View
                        </Link>
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
  );
};

export default AdminDashboard;
