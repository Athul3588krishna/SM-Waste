import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { ArrowLeft, Upload, AlertCircle, Sparkles, Navigation, Check } from 'lucide-react';

// Setup standard Leaflet Marker Icon to avoid Vite packaging failures
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ReportWaste = () => {
  const navigate = useNavigate();
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [latitude, setLatitude] = useState(9.9816); // Kochi default
  const [longitude, setLongitude] = useState(76.2999);
  const [address, setAddress] = useState('');

  // AI Scanner states
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [wasteType, setWasteType] = useState('Mixed');
  const [severity, setSeverity] = useState('Medium');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [scanStatus, setScanStatus] = useState('AI Scanner analyzing image...');

  // UI state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Map Click handler component
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
        setAddress(`Coordinates: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`);
      },
    });
    return null;
  };

  // Center map on user's browser location
  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setAddress(`My Current Location (Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)})`);
        },
        (error) => {
          console.error(error);
          alert('Could not determine your location. Please click on the map manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Simulate AI waste scanner
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError('');
    setScanning(true);
    setScanComplete(false);
    setAiAnalysis('');
    setScanStatus('Optimizing image buffer...');

    const statuses = [
      "Optimizing image buffer...",
      "Analyzing visual markers...",
      "Connecting to Gemini 1.5 Flash API...",
      "Classifying waste characteristics...",
      "Finalizing diagnostic report..."
    ];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < statuses.length - 1) {
        idx++;
        setScanStatus(statuses[idx]);
      }
    }, 600);

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const { data } = await API.post('/complaints/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setWasteType(data.wasteType);
      setSeverity(data.severity);
      setAiAnalysis(data.explanation || '');
      setScanStatus('AI Scan Successful!');
    } catch (err) {
      console.error('AI Scan failed, falling back to local defaults:', err);
      // fallback defaults
      setWasteType('Mixed');
      setSeverity('Medium');
      setAiAnalysis('Local scanning fallback classification applied.');
      setScanStatus('AI Scan Complete (Fallback Mode)');
    } finally {
      clearInterval(interval);
      setScanning(false);
      setScanComplete(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo) {
      setError('Please upload a photo of the waste dump.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('photo', photo);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('address', address || `Waste reported at Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
    formData.append('wasteType', wasteType);
    formData.append('severity', severity);
    if (aiAnalysis) {
      formData.append('aiAnalysis', aiAnalysis);
    }

    try {
      await API.post('/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px 24px', maxWidth: '900px', margin: '0 auto' }}>
      
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
          <h1 style={{ fontSize: '24px', color: 'var(--text-primary)' }}>Report Garbage Dump</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Pin the location and upload a photo to notify authorities.</p>
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

      <form onSubmit={handleSubmit} className="grid-2" style={{ gap: '30px' }}>
        
        {/* Left Side: Upload & AI Diagnosis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px' }}>1. Upload Photo</h3>
            
            <input
              type="file"
              id="photo-picker"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />

            {!photoPreview ? (
              <label htmlFor="photo-picker" className="scanner-container">
                <Upload size={32} color="var(--color-primary)" style={{ marginBottom: '12px' }} />
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Select Photo</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>PNG, JPG or JPEG up to 5MB</span>
              </label>
            ) : (
              <div style={{ position: 'relative' }}>
                <div className={`scanner-container ${scanning ? 'scanner-running' : ''}`} style={{ padding: '4px' }}>
                  <img src={photoPreview} alt="upload preview" className="scanner-preview" />
                  
                  {scanning && (
                    <div className="scanner-overlay">
                      <div className="scanner-line"></div>
                    </div>
                  )}
                </div>
                
                <label htmlFor="photo-picker" className="btn btn-secondary" style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  borderRadius: '6px',
                  zIndex: 2
                }}>
                  Change
                </label>
              </div>
            )}

            {/* AI Diagnostics Box */}
            {scanning && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(16, 185, 129, 0.04)',
                border: '1px dashed var(--color-primary)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <Sparkles size={16} className="text-gradient" />
                <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: '600' }}>{scanStatus}</span>
              </div>
            )}

            {scanComplete && (
              <div className="glass-panel" style={{
                marginTop: '16px',
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                padding: '16px',
                borderRadius: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Sparkles size={16} color="var(--color-primary)" />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)' }}>AI Scan Diagnosis</span>
                </div>

                {aiAnalysis && (
                  <div style={{
                    marginBottom: '16px',
                    padding: '10px 12px',
                    background: 'rgba(59, 130, 246, 0.04)',
                    border: '1px solid rgba(59, 130, 246, 0.15)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic',
                    lineHeight: '1.4'
                  }}>
                    <strong style={{ color: 'var(--color-secondary)', fontStyle: 'normal', fontSize: '10px', textTransform: 'uppercase', display: 'block', marginBottom: '4px', letterSpacing: '0.5px' }}>
                      🤖 AI Vision Analysis Summary
                    </strong>
                    "{aiAnalysis}"
                  </div>
                )}

                <div className="grid-2" style={{ gap: '12px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Waste Type</label>
                    <select
                      className="form-input"
                      value={wasteType}
                      onChange={(e) => setWasteType(e.target.value)}
                      style={{ padding: '8px 12px', fontSize: '13px' }}
                    >
                      <option value="Organic">Organic</option>
                      <option value="Plastic">Plastic</option>
                      <option value="E-waste">E-waste</option>
                      <option value="Hazardous">Hazardous</option>
                      <option value="Mixed">Mixed</option>
                      <option value="Medical">Medical</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Severity</label>
                    <select
                      className="form-input"
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                      style={{ padding: '8px 12px', fontSize: '13px' }}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={12} color="var(--color-primary)" /> AI predicted category. Feel free to override.
                </div>
              </div>
            )}
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px' }}>2. Report Details</h3>
            
            <div className="form-group">
              <label className="form-label">Report Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Plastic pile on main road corner"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Description / Landmarks</label>
              <textarea
                className="form-input"
                placeholder="Describe the waste details and any landmarks..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                style={{ resize: 'none' }}
                required
              ></textarea>
            </div>
          </div>
        </div>

        {/* Right Side: Map selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>3. Select Location</h3>
              <button
                type="button"
                onClick={locateUser}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
              >
                <Navigation size={12} /> Locate Me
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Location Address / landmark</label>
              <input
                type="text"
                className="form-input"
                placeholder="Click map or type approximate address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="map-container" style={{ flex: 1, minHeight: '300px' }}>
              <MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latitude, longitude]} icon={customIcon} />
                <MapClickHandler />
              </MapContainer>
            </div>
            
            <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
              📍 <em>Click anywhere on the map to pin the exact coordinates of the waste.</em>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px' }}
            disabled={loading || scanning}
          >
            {loading ? 'Submitting Report...' : 'Submit Report'}
          </button>
        </div>

      </form>

    </div>
  );
};

export default ReportWaste;
