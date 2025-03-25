// src/components/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ roleRequired }) => {
  const { user, loading } = useAuth();
  
  // If auth is still loading, show nothing
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // If role is required and user doesn't have it, redirect to appropriate dashboard
  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to={`/dashboard/${user.role}`} />;
  }
  
  // If all checks pass, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;