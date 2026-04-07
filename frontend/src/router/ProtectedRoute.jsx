import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, token } = useAuthStore();
  const location = useLocation();

  if (!token) {
    // Redirect to login but save the current location to redirect back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // If user's role is not allowed, redirect to dashboard or an unauthorized page
    return <Navigate to="/dashboard" replace />;
  }

  return children ?? <Outlet />;
};

export default ProtectedRoute;
