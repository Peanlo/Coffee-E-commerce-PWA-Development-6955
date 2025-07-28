import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (adminOnly) {
    if (!isAdmin) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
  } else {
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;