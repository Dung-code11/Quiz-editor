import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const userStr = localStorage.getItem('currentUser');
  
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (allowedRole && user.role !== allowedRole) {
      if (user.role === 'admin') {
        return <Navigate to="/quiz/editor" replace />;
      } else {
        return <Navigate to="/quiz/list" replace />;
      }
    }
    return children;
  } catch (error) {
    localStorage.removeItem('currentUser');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;