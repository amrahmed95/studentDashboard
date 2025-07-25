import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const requireAuth = <P extends object>(Component: React.ComponentType<P>) => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { isLoggedIn } = useAuth();
    const token = localStorage.getItem('token');

    return isLoggedIn && token ? (
      <Component {...props} />
    ) : (
      <Navigate to="/" replace />
    );
  };

  return AuthenticatedComponent;
};

export default requireAuth;