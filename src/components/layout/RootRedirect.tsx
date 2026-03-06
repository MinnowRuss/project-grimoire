import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function RootRedirect() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-void">
        <p className="font-ui text-sm text-faded animate-pulse">Loading...</p>
      </div>
    );
  }

  return <Navigate to={session ? '/app' : '/login'} replace />;
}
