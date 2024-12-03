import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute() {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
}