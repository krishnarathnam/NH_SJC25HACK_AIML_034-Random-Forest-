import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');

  // If no token or user, redirect to login
  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

