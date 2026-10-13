import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, checking } = useAuth();
  if (checking) return <div className="boot" role="status">Loading your workspace…</div>;
  return user ? children : <Navigate to="/login" replace />;
}
