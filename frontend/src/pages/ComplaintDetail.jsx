import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ArrowLeft, Clock, ShieldCheck, Hammer, CheckCircle2, AlertTriangle, MapPin, Calendar } from 'lucide-react';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaintDetail = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/complaints/detail/${id}`);
        setComplaint(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintDetail();
  }, [id]);

  const getBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'verified': return 'status-verified';
      case 'assigned': return 'status-assigned';
      case 'in_progress': return 'status-assigned';
      case 'cleaned': return 'status-verified';
      case 'completed': return 'status-completed';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading details...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Report Not Found</h2>
        <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginTop: '16px' }}>
          Go Back
        </button>
      </div>
    );
  }

  // Check which steps are active based on status
  const steps = [
    {
      title: 'Reported',
      desc: 'Submitted by citizen with before photo.',
      date: complaint.createdAt,
      active: true,
      completed: true,
      icon: <Clock size={12} />
    },
    {
      title: 'Verified',
      desc: complaint.status === 'rejected' ? 'Rejected by Admin' : 'Verified by municipality admin.',
      date: complaint.status !== 'pending' ? complaint.updatedAt : null,
      active: complaint.status !== 'pending',
      completed: complaint.status !== 'pending' && complaint.status !== 'rejected',
      isRejected: complaint.status === 'rejected',
      icon: <ShieldCheck size={12} />
    },
    {
      title: 'Assigned & Accepted',
      desc: complaint.assignedToType === 'team' && complaint.team 
        ? `Assigned to team "${complaint.team.name}". ${complaint.worker ? `Accepted by worker ${complaint.worker.name}.` : 'Awaiting worker acceptance.'}`
        : complaint.worker 
          ? `Assigned to worker "${complaint.worker.name}". ${complaint.status !== 'assigned' ? 'Accepted by worker.' : 'Awaiting worker acceptance.'}`
          : 'Awaiting worker or team assignment.',
      date: complaint.assignedAt,
      active: ['assigned', 'in_progress', 'cleaned', 'completed'].includes(complaint.status),
      completed: ['in_progress', 'cleaned', 'completed'].includes(complaint.status),
      icon: <Hammer size={12} />
    },
    {
      title: 'Cleaned Up',
      desc: ['cleaned', 'completed'].includes(complaint.status) ? 'Worker completed cleanup. Awaiting admin verification.' : 'Cleanup in progress.',
      date: complaint.cleanedAt,
      active: ['in_progress', 'cleaned', 'completed'].includes(complaint.status),
      completed: ['cleaned', 'completed'].includes(complaint.status),
      icon: <CheckCircle2 size={12} />
    },
    {
      title: 'Resolved',
      desc: complaint.status === 'completed' ? `Cleanup verified. ${complaint.bonusAmount > 0 ? `Bonus payment of $${complaint.bonusAmount} paid to worker.` : ''}` : 'Awaiting final verification.',
      date: complaint.completedAt,
      active: complaint.status === 'completed',
      completed: complaint.status === 'completed',
      icon: <CheckCircle2 size={12} />
    }
  ];

  return (
    <div style={{ padding: '30px 24px', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Back Header */}
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
          <span className={`badge-status ${getBadgeClass(complaint.status)}`}>
            {complaint.status.replace('_', ' ')}
          </span>
          <h1 style={{ fontSize: '24px', color: 'var(--text-primary)', marginTop: '6px' }}>{complaint.title}</h1>
        </div>
      </div>

      <div className="grid-3-1" style={{ gap: '30px' }}>
        
        {/* Left Side: Timeline & Photos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Progress Timeline */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px' }}>Resolution lifecycle tracker</h3>
            
            <div className="timeline">
              {steps.map((step, idx) => {
                if (step.isRejected) {
                  return (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-badge" style={{ background: 'var(--color-danger)', borderColor: 'var(--color-danger)', color: '#fff' }}>
                        <AlertTriangle size={12} />
                      </div>
                      <div className="timeline-content" style={{ borderLeft: '4px solid var(--color-danger)' }}>
                        <h4 style={{ color: 'var(--color-danger)', fontWeight: '700' }}>Rejected</h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          This report was flagged as invalid or duplicate by the administrator.
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={idx} className="timeline-item">
                    <div className={`timeline-badge ${step.completed ? 'completed' : step.active ? 'active' : ''}`}>
                      {step.icon}
                    </div>
                    <div className="timeline-content" style={{
                      opacity: step.active ? 1 : 0.5,
                      borderLeft: step.completed ? '4px solid var(--color-primary)' : '1px solid var(--border-glass)'
                    }}>
                      <div className="flex-between">
                        <h4 style={{ color: step.active ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: '600' }}>
                          {step.title}
                        </h4>
                        {step.date && (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {new Date(step.date).toLocaleDateString()} {new Date(step.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Photos Grid */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px' }}>Cleaning Verification comparative slider</h3>
            
            <div className="comparison-slider">
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 'bold' }}>BEFORE CLEANUP (SUBMITTED)</div>
                <img
                  src={complaint.photoBefore.startsWith('http') ? complaint.photoBefore : `http://localhost:5000${complaint.photoBefore}`}
                  alt="Before cleanup"
                  className="comparison-image"
                  style={{ height: '240px' }}
                />
              </div>

              {['cleaned', 'completed'].includes(complaint.status) && complaint.photoAfter && (
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-primary)', marginBottom: '6px', fontWeight: 'bold' }}>AFTER CLEANUP (RESOLVED)</div>
                  <img
                    src={complaint.photoAfter.startsWith('http') ? complaint.photoAfter : `http://localhost:5000${complaint.photoAfter}`}
                    alt="After cleanup"
                    className="comparison-image"
                    style={{ height: '240px', borderColor: 'var(--color-primary)' }}
                  />
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Details & Map location */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Details Card */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
              Report Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Description</div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '2px' }}>{complaint.description}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Category</div>
                  <span style={{ fontSize: '13px', background: 'rgba(255,255,255,0.03)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginTop: '2px' }}>
                    {complaint.wasteType}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Severity</div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: complaint.severity === 'High' ? 'var(--color-danger)' : complaint.severity === 'Medium' ? 'var(--color-warning)' : 'var(--color-primary)',
                    display: 'inline-block',
                    marginTop: '2px'
                  }}>
                    {complaint.severity}
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reported By</div>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '2px' }}>{complaint.citizen?.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rank: {complaint.citizen?.badge}</div>
              </div>

              {complaint.team && (
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned Team</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '2px' }}>👥 {complaint.team?.name}</div>
                </div>
              )}

              {complaint.worker && (
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned Worker</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '2px' }}>👷 {complaint.worker?.name}</div>
                </div>
              )}
            </div>
          </div>

          {/* Location Map */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', height: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <MapPin size={14} color="var(--color-secondary)" />
              <span style={{ fontWeight: '500' }}>Incident Coordinates</span>
            </div>
            
            <div className="map-container" style={{ flex: 1, margin: 0 }}>
              <MapContainer center={[complaint.location.latitude, complaint.location.longitude]} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[complaint.location.latitude, complaint.location.longitude]} icon={customIcon}>
                  <Popup>{complaint.title}</Popup>
                </Marker>
              </MapContainer>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
              {complaint.location.address}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ComplaintDetail;
