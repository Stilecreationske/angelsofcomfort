import { Navigate } from 'react-router-dom';
import { useAuth, type UserRole } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
  redirectTo: string;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, redirectTo, allowedRoles }: ProtectedRouteProps) => {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f0ec]">
        <p className="text-lg text-[#3c2b1c]" style={{ fontFamily: "'Lora', serif" }}>
          Checking your access...
        </p>
      </main>
    );
  }

  if (!session) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && (!profile || !allowedRoles.includes(profile.role))) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
