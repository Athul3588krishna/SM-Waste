import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import ReportWaste from './pages/ReportWaste';
import ComplaintDetail from './pages/ComplaintDetail';
import Profile from './pages/Profile';
import Home from './pages/Home';

// Protected Route wrapper component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Verifying credentials...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Home Route dispatcher component
const HomeDispatcher = () => {
  const { user } = useContext(AuthContext);

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }
  if (user?.role === 'worker') {
    return <WorkerDashboard />;
  }
  // Default is citizen
  return <CitizenDashboard />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Workspace Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <HomeDispatcher />
                  </ProtectedRoute>
                }
              />

              {/* Citizen specific reporting page */}
              <Route
                path="/report"
                element={
                  <ProtectedRoute allowedRoles={['citizen']}>
                    <ReportWaste />
                  </ProtectedRoute>
                }
              />

              {/* Shared Profile Settings page */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Shared Complaint Details page */}
              <Route
                path="/complaint/:id"
                element={
                  <ProtectedRoute>
                    <ComplaintDetail />
                  </ProtectedRoute>
                }
              />

              {/* Redirect any other URLs back to root */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};


export default App;
