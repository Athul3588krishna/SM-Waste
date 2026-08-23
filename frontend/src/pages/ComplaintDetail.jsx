import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ArrowLeft, Clock, ShieldCheck, Hammer, CheckCircle2, AlertTriangle, MapPin, Calendar, Sparkles, Printer, X, FileText } from 'lucide-react';

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
  const [showPrintModal, setShowPrintModal] = useState(false);

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

        {/* Printable Receipt Action - Only visible when complaint is resolved/completed */}
        {['completed', 'resolved', 'cleaned'].includes(complaint.status) && (
          <button
            onClick={() => setShowPrintModal(true)}
            className="btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              fontSize: '13px',
              fontWeight: '700',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
              cursor: 'pointer'
            }}
          >
            <Printer size={16} />
            Download Official Receipt
          </button>
        )}
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
                  src={complaint.photoBefore.startsWith('http') ? complaint.photoBefore : `http://localhost:5002${complaint.photoBefore}`}
                  alt="Before cleanup"
                  className="comparison-image"
                  style={{ height: '240px' }}
                />
              </div>

              {['cleaned', 'completed'].includes(complaint.status) && complaint.photoAfter && (
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-primary)', marginBottom: '6px', fontWeight: 'bold' }}>AFTER CLEANUP (RESOLVED)</div>
                  <img
                    src={complaint.photoAfter.startsWith('http') ? complaint.photoAfter : `http://localhost:5002${complaint.photoAfter}`}
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

              {complaint.aiAnalysis && (
                <div style={{ 
                  marginTop: '12px',
                  padding: '12px', 
                  background: 'rgba(16, 185, 129, 0.05)', 
                  border: '1px solid rgba(16, 185, 129, 0.2)', 
                  borderRadius: '8px' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Sparkles size={14} color="var(--color-primary)" />
                    <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      AI Diagnostic Insights
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic', lineHeight: '1.4' }}>
                    "{complaint.aiAnalysis}"
                  </p>
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
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
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

      {/* Printable Receipt Modal Overlay */}
      {showPrintModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px',
          overflowY: 'auto'
        }}>
          <div style={{
            background: '#ffffff',
            color: '#1e293b',
            width: '100%',
            maxWidth: '750px',
            borderRadius: '12px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            padding: '36px',
            position: 'relative',
            fontFamily: 'Arial, sans-serif'
          }} id="printable-receipt-card">

            {/* Actions Bar (Hidden on print) */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              borderBottom: '2px solid #e2e8f0',
              paddingBottom: '16px'
            }} className="no-print">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#0f172a' }}>
                <FileText size={20} color="#10b981" />
                <span>Incident Resolution Receipt Preview</span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Printer size={16} /> Print / Save PDF
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  style={{
                    background: '#f1f5f9',
                    color: '#64748b',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    cursor: 'pointer'
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Receipt Document Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '3px double #10b981', paddingBottom: '16px' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#064e3b', letterSpacing: '1px' }}>
                🌐 ECOCLEAN MUNICIPAL SANITATION PORTAL
              </div>
              <div style={{ fontSize: '13px', color: '#047857', fontWeight: 'bold', marginTop: '4px' }}>
                OFFICIAL CIVIC INCIDENT RESOLUTION RECEIPT &amp; TICKET AUDIT
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                TICKET REF: <strong>#EC-{complaint._id.slice(-8).toUpperCase()}</strong> | ISSUED DATE: {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Grid Information */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Incident Title</div>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', marginTop: '2px' }}>{complaint.title}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Current Status</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: complaint.status === 'completed' ? '#047857' : '#d97706', marginTop: '2px' }}>
                  ● {complaint.status.toUpperCase().replace('_', ' ')}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Reporter Name &amp; Rank</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#334155', marginTop: '2px' }}>
                  {complaint.citizen?.name || 'Anonymous Citizen'} ({complaint.citizen?.badge || 'Civic Member'})
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Eco-Reward Points</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#047857', marginTop: '2px' }}>
                  +50 Eco-Points Awarded
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Waste Category &amp; Severity</div>
                <div style={{ fontSize: '13px', color: '#334155', marginTop: '2px' }}>
                  {complaint.wasteType} | <strong>{complaint.severity} Severity</strong>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Assigned Sanitation Unit</div>
                <div style={{ fontSize: '13px', color: '#334155', marginTop: '2px' }}>
                  {complaint.team ? `👥 ${complaint.team.name}` : complaint.worker ? `👷 ${complaint.worker.name}` : 'Municipal Crew'}
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Geotagged Address</div>
                <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px' }}>
                  📍 {complaint.location.address} (Lat: {complaint.location.latitude.toFixed(4)}, Lng: {complaint.location.longitude.toFixed(4)})
                </div>
              </div>
            </div>

            {/* Before / After Photos Verification Showcase */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', color: '#0f172a', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
                📷 Cleaning Verification Proof Evidence
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#dc2626', fontWeight: 'bold', marginBottom: '4px' }}>BEFORE (REPORTED DUMP)</div>
                  <img
                    src={complaint.photoBefore.startsWith('http') ? complaint.photoBefore : `http://localhost:5002${complaint.photoBefore}`}
                    alt="Before Dump"
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: 'bold', marginBottom: '4px' }}>AFTER (CLEANED SITE)</div>
                  {complaint.photoAfter ? (
                    <img
                      src={complaint.photoAfter.startsWith('http') ? complaint.photoAfter : `http://localhost:5002${complaint.photoAfter}`}
                      alt="After Cleanup"
                      style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #16a34a' }}
                    />
                  ) : (
                    <div style={{ height: '140px', background: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                      Cleanup photo pending verification
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Municipal Stamp Seal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #cbd5e1', paddingTop: '16px' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                <span>Official Record of Municipal Waste Management System.</span>
                <br />
                <span>Generated electronically via EcoClean Smart Platform.</span>
              </div>
              <div style={{
                border: '2px solid #047857',
                color: '#047857',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '900',
                textTransform: 'uppercase',
                transform: 'rotate(-3deg)'
              }}>
                ✓ VERIFIED &amp; RESOLVED
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ComplaintDetail;
