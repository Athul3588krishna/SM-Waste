import React, { useContext, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';
import EcoCursor from './components/EcoCursor';
import LoadingSpinner from './components/LoadingSpinner';

// Dynamic Page Lazy Loading for Performance & Fast Initial Page Load
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const CitizenDashboard = lazy(() => import('./pages/CitizenDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const WorkerDashboard = lazy(() => import('./pages/WorkerDashboard'));
const ReportWaste = lazy(() => import('./pages/ReportWaste'));
const ComplaintDetail = lazy(() => import('./pages/ComplaintDetail'));
const Profile = lazy(() => import('./pages/Profile'));

// Protected Route wrapper component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)' }}>
        <LoadingSpinner label="Verifying credentials..." />
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

const PageFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    <LoadingSpinner size="lg" label="Loading portal..." />
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageFallback />}>
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

          {/* Direct Role Routes */}
          <Route 
            path="/admin" 
            element={user?.role === 'admin' ? <PageTransition><AdminDashboard /></PageTransition> : <PageTransition><Login /></PageTransition>} 
          />
          <Route 
            path="/worker" 
            element={user?.role === 'worker' ? <PageTransition><WorkerDashboard /></PageTransition> : <PageTransition><Login /></PageTransition>} 
          />
          <Route 
            path="/citizen" 
            element={user?.role === 'citizen' ? <PageTransition><CitizenDashboard /></PageTransition> : <PageTransition><Login /></PageTransition>} 
          />

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
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <BrowserRouter>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <div style={{ flex: 1 }}>
                  <AnimatedRoutes />
                </div>
                <EcoCursor />
              </div>
            </BrowserRouter>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
