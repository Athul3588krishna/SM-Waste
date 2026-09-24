import React, { useContext, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';
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
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)' }}>
        <LoadingSpinner label="Verifying credentials..." />
      </div>
    );
  }

  if (!user) {
    const roleMatch = location.pathname.match(/\/(admin|worker)/);
    const target = roleMatch ? `/login?role=${roleMatch[1]}` : '/login';
    return <Navigate to={target} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const roleMatch = location.pathname.match(/\/(admin|worker)/);
    if (roleMatch) {
      return <Navigate to={`/login?role=${roleMatch[1]}`} replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Global Hash Route Handler to intercept #admin, #worker, etc. anywhere across the site
const HashRouteHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleHash = () => {
      const hash = (window.location.hash || location.hash || '').toLowerCase();
      if (hash === '#admin' || hash === '#/admin' || hash === '#adminlogin') {
        if (location.pathname !== '/login' || !location.search.includes('role=admin')) {
          navigate('/login?role=admin');
        }
      } else if (hash === '#worker' || hash === '#/worker' || hash === '#workerlogin') {
        if (location.pathname !== '/login' || !location.search.includes('role=worker')) {
          navigate('/login?role=worker');
        }
      } else if (hash === '#citizen' || hash === '#/citizen') {
        if (location.pathname !== '/login' || !location.search.includes('role=citizen')) {
          navigate('/login?role=citizen');
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [location.pathname, location.search, location.hash, navigate]);

  return null;
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
    <Suspense fallback={<PageFallback />}>
      <Routes location={location} key={location.pathname}>
        {/* Public Routes - Auto-redirect logged-in users to their respective dashboard unless explicitly accessing a different portal */}
        <Route 
          path="/" 
          element={
            user ? (
              <Navigate to={user.role === 'admin' ? '/admin' : user.role === 'worker' ? '/worker' : '/dashboard'} replace />
            ) : (
              <PageTransition><Home /></PageTransition>
            )
          } 
        />
        <Route 
          path="/login" 
          element={
            user && (!location.search.includes('role=') || location.search.includes(`role=${user.role}`)) ? (
              <Navigate to={user.role === 'admin' ? '/admin' : user.role === 'worker' ? '/worker' : '/dashboard'} replace />
            ) : (
              <PageTransition><Login /></PageTransition>
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <PageTransition><Register /></PageTransition>
            )
          } 
        />

        {/* Direct Role Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PageTransition><AdminDashboard /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/worker" 
          element={
            <ProtectedRoute allowedRoles={['worker']}>
              <PageTransition><WorkerDashboard /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/citizen" 
          element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <PageTransition><CitizenDashboard /></PageTransition>
            </ProtectedRoute>
          } 
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
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <BrowserRouter>
              <HashRouteHandler />
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <div style={{ flex: 1 }}>
                  <AnimatedRoutes />
                </div>
              </div>
            </BrowserRouter>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
