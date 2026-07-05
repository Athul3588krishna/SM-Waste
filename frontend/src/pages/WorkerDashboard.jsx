import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Hammer, MapPin, CheckSquare, Upload, AlertCircle, Eye, Calendar, Clock, Clipboard } from 'lucide-react';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const WorkerDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  // Complete Modal states
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchWorkerTasks = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/worker/complaints');
      setComplaints(data);
      if (data.length > 0) {
        // Default select first assigned task if exists, else first task
        const active = data.find((t) => t.status === 'assigned') || data[0];
        setSelectedTask(active);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerTasks();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleCompleteTask = async (e) => {
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
      await API.put(`/worker/complaints/${selectedTask._id}/complete`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Congratulations! Task completed and points awarded to the Citizen!');
      setShowModal(false);
      setPhoto(null);
      setPhotoPreview(null);
      fetchWorkerTasks();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to complete task.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading assignments...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--color-primary)', padding: '8px', borderRadius: '8px' }}>
          <Hammer size={20} color="#000" />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', color: 'var(--text-primary)' }}>Worker Assignment Sheet</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>View your cleanup tasks, map coordinates, and upload completed photos.</p>
        </div>
      </div>

      {complaints.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <Clipboard size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '20px', color: 'var(--text-primary)' }}>No Tasks Assigned</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>You currently have no active or completed sanitation tasks.</p>
        </div>
      ) : (
        <div className="grid-1-3" style={{ gap: '30px' }}>
          
          {/* Left panel: Task List */}
          <div className="glass-panel" style={{ padding: '20px', alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px' }}>
              Tasks Registry ({complaints.length})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
              {complaints.map((task) => (
                <div
                  key={task._id}
                  onClick={() => setSelectedTask(task)}
                  style={{
                    padding: '14px',
                    background: selectedTask?._id === task._id ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.01)',
                    border: selectedTask?._id === task._id ? '1px solid var(--color-primary)' : '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div className="flex-between">
                    <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '600' }}>
                      {task.title.slice(0, 24)}{task.title.length > 24 ? '...' : ''}
                    </h4>
                    <span className={`badge-status ${task.status === 'completed' ? 'status-completed' : 'status-assigned'}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                      {task.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={10} /> {task.location.address.slice(0, 30)}...
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: Selected Task Details */}
          {selectedTask && (
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span className={`badge-status ${selectedTask.status === 'completed' ? 'status-completed' : 'status-assigned'}`}>
                    {selectedTask.status}
                  </span>
                  <h2 style={{ fontSize: '22px', color: 'var(--text-primary)', marginTop: '8px' }}>
                    {selectedTask.title}
                  </h2>
                </div>
                {selectedTask.status === 'assigned' && (
                  <button
                    onClick={() => {
                      setError('');
                      setPhoto(null);
                      setPhotoPreview(null);
                      setShowModal(true);
                    }}
                    className="btn btn-primary"
                    style={{ padding: '10px 18px' }}
                  >
                    <CheckSquare size={16} /> Mark Cleaned
                  </button>
                )}
              </div>

              {/* Details card */}
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
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Waste Category</div>
                      <span style={{ fontSize: '13px', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>
                        {selectedTask.wasteType}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Severity Level</div>
                      <span style={{
                        fontSize: '13px',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={14} color="var(--color-secondary)" />
                    <span><strong>Address:</strong> {selectedTask.location.address}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} color="var(--color-secondary)" />
                    <span><strong>Assigned:</strong> {new Date(selectedTask.assignedAt).toLocaleDateString()}</span>
                  </div>
                  {selectedTask.status === 'completed' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={14} color="var(--color-primary)" />
                      <span><strong>Cleaned On:</strong> {new Date(selectedTask.completedAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Images comparison slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Cleaning Verification Images</h4>
                
                <div className="comparison-slider">
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>BEFORE CLEANING</div>
                    <img
                      src={selectedTask.photoBefore.startsWith('http') ? selectedTask.photoBefore : `http://localhost:5000${selectedTask.photoBefore}`}
                      alt="Before cleanup"
                      className="comparison-image"
                    />
                  </div>
                  {selectedTask.status === 'completed' && (
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--color-primary)', marginBottom: '4px' }}>AFTER CLEANING</div>
                      <img
                        src={selectedTask.photoAfter.startsWith('http') ? selectedTask.photoAfter : `http://localhost:5000${selectedTask.photoAfter}`}
                        alt="After cleanup"
                        className="comparison-image"
                        style={{ borderColor: 'var(--color-primary)' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Map Locator */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '220px' }}>
                <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Navigation Map</h4>
                <div className="map-container" style={{ flex: 1 }}>
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

            </div>
          )}

        </div>
      )}

      {/* Complete Task Upload Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '16px' }}>Complete Cleaning job</h3>
            
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
                marginBottom: '16px'
              }}>
                <AlertCircle size={16} />
                <span style={{ fontSize: '13px' }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleCompleteTask}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Upload Clean street Photo</label>
                <input
                  type="file"
                  id="after-photo"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  required
                />
                
                {!photoPreview ? (
                  <label htmlFor="after-photo" className="scanner-container" style={{ padding: '40px 20px' }}>
                    <Upload size={32} color="var(--color-primary)" style={{ marginBottom: '8px' }} />
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>Click to Upload Photo</span>
                  </label>
                ) : (
                  <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={photoPreview} alt="cleanup verification" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                    <label htmlFor="after-photo" className="btn btn-secondary" style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      borderRadius: '4px'
                    }}>
                      Change
                    </label>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                  disabled={submitting}
                  style={{ padding: '8px 16px', fontSize: '14px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ padding: '8px 16px', fontSize: '14px' }}
                >
                  {submitting ? 'Submitting...' : 'Submit Verification'}
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
