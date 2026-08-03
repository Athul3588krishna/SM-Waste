import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import EcoBotWidget from './components/EcoBotWidget';
import PageTransition from './components/PageTransition';
import EcoCursor from './components/EcoCursor';
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

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

        {/* Protected Workspace Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTransition>
                <HomeDispatcher />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        {/* Citizen specific reporting page */}
        <Route
          path="/report"
          element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <PageTransition>
                <ReportWaste />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        {/* Shared Profile Settings page */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Profile />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        {/* Shared Complaint Details page */}
        <Route
          path="/complaint/:id"
          element={
            <ProtectedRoute>
              <PageTransition>
                <ComplaintDetail />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        {/* Redirect any other URLs back to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <AnimatedRoutes />
          </div>
          <EcoBotWidget />
          <EcoCursor />
        </div>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
