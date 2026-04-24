import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'superadmin' && user.role !== 'superadmin') {
    return <Navigate to="/admin" replace />;
  }

  if (requiredRole === 'admin' && user.role !== 'admin' && user.role !== 'superadmin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
