import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { compressImage } from '../utils/imageCompressor';
import EcoCreditCard from '../components/EcoCreditCard';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Hammer, MapPin, CheckSquare, Upload, AlertCircle, Calendar, Clock, Clipboard, Sparkles, Megaphone, DollarSign, ExternalLink } from 'lucide-react';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const WorkerDashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const { socket } = useSocket();
  const [complaints, setComplaints] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  // Complete cleanup modal
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [workerCoords, setWorkerCoords] = useState(null);

  // Automatically fetch worker's current GPS location for distance calculation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setWorkerCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Worker location access denied/failed for distance tracking:', error.message);
        }
      );
    }
  }, []);

  // Haversine formula to compute distance in kilometers between coordinates
  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchWorkerData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      // Refresh worker details to fetch latest bonuses and online state
      const userRes = await API.get('/auth/me');
      setUser(userRes.data);

      const tasksRes = await API.get('/worker/complaints');
      setComplaints(tasksRes.data);
      if (tasksRes.data.length > 0) {
        // Select first active task if exists, else first task
        const active = tasksRes.data.find((t) => ['assigned', 'in_progress'].includes(t.status)) || tasksRes.data[0];
        setSelectedTask(prev => {
          if (!prev) return active;
          const updatedSelected = tasksRes.data.find((t) => t._id === prev._id);
          return updatedSelected || active;
        });
      }

      const announcementsRes = await API.get('/notifications/announcements');
      setAnnouncements(announcementsRes.data);
    } catch (err) {
      console.error('Error fetching worker dashboard:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [setUser]);

  useEffect(() => {
    fetchWorkerData(true);

    const interval = setInterval(() => {
      fetchWorkerData(false);
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchWorkerData]);

  // Real-time socket events auto-refresh for worker dashboard
  useEffect(() => {
    if (!socket) return;

    const handleRealtimeUpdate = () => {
      fetchWorkerData(false);
    };

    socket.on('complaint_updated', handleRealtimeUpdate);
    socket.on('new_task_assigned', handleRealtimeUpdate);
    socket.on('complaint_completed', handleRealtimeUpdate);
    socket.on('points_updated', handleRealtimeUpdate);
    socket.on('new_announcement', handleRealtimeUpdate);

    return () => {
      socket.off('complaint_updated', handleRealtimeUpdate);
      socket.off('new_task_assigned', handleRealtimeUpdate);
      socket.off('complaint_completed', handleRealtimeUpdate);
      socket.off('points_updated', handleRealtimeUpdate);
      socket.off('new_announcement', handleRealtimeUpdate);
    };
  }, [socket, fetchWorkerData]);

  // Toggle availability (Online/Offline)
  const handleAvailabilityToggle = async () => {
    const newStatus = !user.isOnline;
    try {
      await API.put('/worker/availability', { isOnline: newStatus });
      setUser(prev => ({ ...prev, isOnline: newStatus }));
      alert(`You are now ${newStatus ? 'ONLINE' : 'OFFLINE'}`);
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  // Accept task assignment
  const handleAcceptTask = async (taskId) => {
    try {
      const { data } = await API.put(`/worker/complaints/${taskId}/accept`);
      alert('Task accepted! It is now In Progress.');
      fetchWorkerData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to accept task');
    }
  };

  // File picker upload with automatic canvas compression
  const handleFileChange = async (e) => {
    const rawFile = e.target.files[0];
    if (rawFile) {
      const file = await compressImage(rawFile);
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  // Submit Cleanup photo
  const handleCompleteTaskSubmit = async (e) => {
    e.preventDefault();
    if (!photo) {
      setError('Please upload an after-cleaning photo.');
      return;
    }

    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('photo', photo);

    try {
      await API.put(`/worker/complaints/${selectedTask._id}/clean`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Task marked as Cleaned! Awaiting municipal Admin verification.');
      setShowModal(false);
      setPhoto(null);
      setPhotoPreview(null);
      fetchWorkerData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit cleanup.');
    } finally {
      setSubmitting(false);
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'assigned': return 'status-assigned';
      case 'in_progress': return 'status-assigned';
      case 'cleaned': return 'status-verified'; // Awaiting verification
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  const isTaskOverdue = (task) => {
    if (!task.deadlineAt || ['completed', 'cleaned'].includes(task.status)) return false;
    return new Date(task.deadlineAt) < new Date();
  };

  // Tally total bonuses
  const totalBonuses = user?.bonusHistory?.reduce((sum, item) => sum + item.amount, 0) || 0;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading Worker Workspace...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header Profile summary */}
      <div className="glass-panel" style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Worker Operations Portal
            </span>
            <h1 style={{ fontSize: '30px', color: 'var(--text-primary)', marginTop: '4px' }}>
              Welcome back, {user?.name}
            </h1>
            {user?.team && (
              <p style={{ color: 'var(--color-secondary)', fontSize: '14px', marginTop: '2px', fontWeight: '500' }}>
                👥 Cleaning Team: <strong>{user.team?.name}</strong>
              </p>
            )}
          </div>

          {/* Availability switch toggler */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Availability status:
            </span>
            <button
              onClick={handleAvailabilityToggle}
              className="btn"
              style={{
                background: user.isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${user.isOnline ? 'var(--color-primary)' : 'var(--border-glass)'}`,
                color: user.isOnline ? 'var(--color-primary)' : 'var(--text-secondary)',
                boxShadow: user.isOnline ? 'var(--shadow-neon)' : 'none',
                padding: '8px 16px',
                fontSize: '13px',
                borderRadius: '8px',
                fontWeight: '700'
              }}
            >
              ● {user.isOnline ? 'ONLINE (ACTIVE)' : 'OFFLINE'}
            </button>
          </div>
        </div>

        {/* Bonus Payout Credit Card Banner */}
        <div style={{
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-glass)',
          borderRadius: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <EcoCreditCard
            holderName={user?.name || 'SANITATION WORKER'}
            cardNumber={`5412 ${user?._id ? user._id.slice(-4).padStart(4, '0') : '9104'} 8820 ${totalBonuses}`}
            expiryDate="12/28"
            balanceText={`$${totalBonuses}`}
            cardType="WORKER PAYOUT CARD"
            rankBadge={user?.team ? 'TEAM CREW' : 'FIELD WORKER'}
            theme="cyan"
          />

          <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 210, 255, 0.1)', border: '1px solid var(--color-secondary)', borderRadius: '20px', padding: '4px 12px', width: 'fit-content' }}>
              <DollarSign size={14} color="var(--color-secondary)" />
              <span style={{ fontSize: '11px', color: 'var(--color-secondary)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                Municipal Worker Payroll Wallet
              </span>
            </div>

            <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', margin: 0 }}>
              Performance Bonus Debit Card
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
              Official municipal sanitation payroll card. Cumulative bonuses earned from verified cleanup tasks are automatically deposited here.
            </p>

            <div style={{ marginTop: '6px', fontSize: '22px', fontWeight: '800', color: 'var(--color-secondary)' }}>
              Total Earnings: ${totalBonuses}
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace grid */}
      <div className="grid-3" style={{ gap: '30px' }}>
        
        {/* Column 1: Tasks list */}
        <div className="glass-panel" style={{ alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
            Assigned Cleanup registry ({complaints.length})
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
            {complaints.length === 0 ? (
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No cleanup tasks assigned.</span>
            ) : (
              complaints.map((task) => {
                const isOver = isTaskOverdue(task);
                const dist = workerCoords && task.location?.latitude && task.location?.longitude
                  ? getDistance(workerCoords.latitude, workerCoords.longitude, task.location.latitude, task.location.longitude)
                  : null;

                return (
                  <div
                    key={task._id}
                    onClick={() => setSelectedTask(task)}
                    style={{
                      padding: '12px',
                      background: selectedTask?._id === task._id ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.01)',
                      border: selectedTask?._id === task._id ? '1px solid var(--color-primary)' : '1px solid var(--border-glass)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div className="flex-between">
                      <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {task.title.slice(0, 20)}...
                      </span>
                      <span className={`badge-status ${getBadgeClass(task.status)}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <MapPin size={11} color="var(--color-secondary)" />
                      <span>{task.address ? task.address.slice(0, 22) + '...' : 'Unknown'}</span>
                      {dist !== null && (
                        <span style={{ marginLeft: 'auto', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--color-secondary)', padding: '1px 4px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                          {dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`}
                        </span>
                      )}
                    </div>

                    {task.severity && task.severity.toLowerCase() === 'high' && (
                      <div style={{ 
                        fontSize: '9px', 
                        background: 'rgba(239, 68, 68, 0.12)', 
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444', 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        display: 'inline-flex', 
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '6px', 
                        fontWeight: 'bold'
                      }}>
                        <span style={{ width: '5px', height: '5px', background: '#ef4444', borderRadius: '50%', display: 'inline-block' }}></span>
                        URGENT PRIORITY
                      </div>
                    )}

                    {isOver && (
                      <div style={{ fontSize: '9px', background: 'rgba(255,74,90,0.15)', color: 'var(--color-danger)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '6px', fontWeight: 'bold' }}>
                        ⚠️ OVERDUE DEADLINE
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 2: Selected Task Details */}
        {selectedTask ? (
          <div className="glass-panel" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className={`badge-status ${getBadgeClass(selectedTask.status)}`}>
                  {selectedTask.status.replace('_', ' ')}
                </span>
                <h2 style={{ fontSize: '20px', color: 'var(--text-primary)', marginTop: '8px' }}>
                  {selectedTask.title}
                </h2>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* Accept Task assignment button */}
                {selectedTask.status === 'assigned' && (
                  <button
                    onClick={() => handleAcceptTask(selectedTask._id)}
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    Accept Cleaning Task
                  </button>
                )}

                {/* Mark cleaned photo upload dialog */}
                {selectedTask.status === 'in_progress' && (
                  <button
                    onClick={() => {
                      setError('');
                      setPhoto(null);
                      setPhotoPreview(null);
                      setShowModal(true);
                    }}
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    <CheckSquare size={14} /> Submit Cleanup
                  </button>
                )}
              </div>
            </div>

            {/* Task Info Grid */}
            <div style={{
              padding: '16px',
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid var(--border-glass)',
              borderRadius: '10px',
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '16px'
            }} className="grid-2">
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Description</div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>{selectedTask.description}</p>
                
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Category</div>
                    <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>
                      {selectedTask.wasteType}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Severity</div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: selectedTask.severity === 'High' ? 'var(--color-danger)' : selectedTask.severity === 'Medium' ? 'var(--color-warning)' : 'var(--color-primary)',
                      display: 'inline-block',
                      marginTop: '4px'
                    }}>
                      {selectedTask.severity}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="var(--color-secondary)" />
                  <span><strong>Address:</strong> {selectedTask.location.address}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} color="var(--color-secondary)" />
                  <span><strong>Assigned:</strong> {new Date(selectedTask.assignedAt).toLocaleDateString()}</span>
                </div>
                {selectedTask.deadlineAt && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isTaskOverdue(selectedTask) ? 'var(--color-danger)' : 'var(--text-secondary)' }}>
                    <Calendar size={14} color={isTaskOverdue(selectedTask) ? 'var(--color-danger)' : 'var(--color-secondary)'} />
                    <span><strong>Deadline:</strong> {new Date(selectedTask.deadlineAt).toLocaleDateString()} {new Date(selectedTask.deadlineAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Before/After verification */}
            <div className="comparison-slider">
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>BEFORE CLEANUP</div>
                <img
                  src={selectedTask.photoBefore.startsWith('http') ? selectedTask.photoBefore : `http://localhost:5002${selectedTask.photoBefore}`}
                  alt="Before cleanup"
                  className="comparison-image"
                />
              </div>
              {selectedTask.photoAfter && (
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-primary)', marginBottom: '4px' }}>AFTER CLEANUP</div>
                  <img
                    src={selectedTask.photoAfter.startsWith('http') ? selectedTask.photoAfter : `http://localhost:5002${selectedTask.photoAfter}`}
                    alt="After cleanup"
                    className="comparison-image"
                    style={{ borderColor: 'var(--color-primary)' }}
                  />
                </div>
              )}
            </div>

            {/* Selected Task Location Map */}
            <div style={{ height: '200px' }}>
              <div className="map-container" style={{ height: '100%' }}>
                <MapContainer center={[selectedTask.location.latitude, selectedTask.location.longitude]} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[selectedTask.location.latitude, selectedTask.location.longitude]} icon={customIcon}>
                    <Popup>{selectedTask.title}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>

            {/* Get Directions Button */}
            <div style={{ marginTop: '12px' }}>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedTask.location.latitude},${selectedTask.location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '600',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  color: 'var(--color-secondary)',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                  e.currentTarget.style.borderColor = 'var(--color-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                }}
              >
                <ExternalLink size={14} />
                Get Navigation Directions (Google Maps)
              </a>
            </div>

          </div>
        ) : (
          <div className="glass-panel" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '60px' }}>
            <Clipboard size={40} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Select a task from the list to view cleanup details.</span>
          </div>
        )}

      </div>

      {/* Row 2: Bulletins & Bonus Ledgers */}
      <div className="grid-2" style={{ gap: '30px', marginTop: '30px' }}>
        {/* Worker Announcements Feed */}
        <div className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Megaphone size={18} color="var(--color-secondary)" />
            <h3 style={{ fontSize: '16px', color: 'var(--text-primary)' }}>Municipal Workers Bulletins</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
            {announcements.length === 0 ? (
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No active bulletins.</span>
            ) : (
              announcements.map((a) => (
                <div key={a._id} style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}>
                  <h4 style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600' }}>{a.title}</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>{a.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dummy Bonus ledger history */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '20px' }}>Dummy Bonus Payout History</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
            {!user.bonusHistory || user.bonusHistory.length === 0 ? (
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No bonus payouts recorded yet.</span>
            ) : (
              user.bonusHistory.map((b, idx) => (
                <div key={idx} className="flex-between" style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.02)', border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>Cleanup Bonus Awarded</span>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Date: {new Date(b.date).toLocaleDateString()}
                    </div>
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-primary)' }}>+${b.amount}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL: SUBMIT CLEANUP */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '380px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px' }}>Submit Cleanup Verification</h3>

            {error && (
              <div style={{ background: 'rgba(255,74,90,0.1)', border: '1px solid rgba(255,74,90,0.2)', padding: '10px', color: 'var(--color-danger)', fontSize: '13px', borderRadius: '6px', marginBottom: '14px' }}>
                <AlertCircle size={14} style={{ marginRight: '6px', display: 'inline' }} /> {error}
              </div>
            )}

            <form onSubmit={handleCompleteTaskSubmit}>
              <div className="form-group">
                <label className="form-label">Upload street after-cleaning photo</label>
                <input
                  type="file"
                  id="cleanup-file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  required
                />
                {!photoPreview ? (
                  <label htmlFor="cleanup-file" className="scanner-container" style={{ padding: '30px 10px' }}>
                    <Upload size={24} color="var(--color-primary)" style={{ marginBottom: '6px' }} />
                    <span style={{ fontSize: '12px', fontWeight: '600' }}>Choose Photo</span>
                  </label>
                ) : (
                  <div style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden' }}>
                    <img src={photoPreview} alt="verification" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover' }} />
                    <label htmlFor="cleanup-file" className="btn btn-secondary" style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px 8px', fontSize: '10px' }}>Change</label>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary" disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Uploading...' : 'Submit Cleanup'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default WorkerDashboard;
