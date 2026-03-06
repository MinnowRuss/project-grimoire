import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function AuthGuard() {
  const { session, loading } = useAuth();
  const location = useLocation();

  // Show nothing while checking session — prevents login page flash
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-void">
        <p className="font-ui text-sm text-faded animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!session) {
    // Preserve the intended destination for post-login redirect
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
