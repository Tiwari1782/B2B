import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/common/ToastNotification';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoaderProvider } from './context/LoaderContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import B2BLoader from './components/common/B2BLoader';
import SkeletonLoader from './components/common/SkeletonLoader';
import AIChatbot from './components/common/AIChatbot';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Team from './pages/Team';
import Contributors from './pages/Contributors';
import Partnership from './pages/Partnership';
import Contact from './pages/Contact';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AIChatPage from './pages/AIChatPage';

const AppContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/superadmin');
  const isChatPage = location.pathname === '/ai';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <B2BLoader />
      <SkeletonLoader />
      {!isDashboard && <Navbar />}
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contributors" element={<Contributors />} />
          <Route path="/partnership" element={<Partnership />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ai" element={<AIChatPage />} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />

          {/* SuperAdmin */}
          <Route path="/superadmin" element={<ProtectedRoute requiredRole="superadmin"><SuperAdminDashboard /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
      {!isDashboard && !isChatPage && <AIChatbot />}
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <AuthProvider>
        <LoaderProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </LoaderProvider>
      </AuthProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
