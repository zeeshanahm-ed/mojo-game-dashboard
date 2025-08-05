import { Navigate } from 'react-router-dom';
import * as authHelper from '../auth/core/auth-helpers'; // Assuming you have this helper to get current user data
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const currentUser = authHelper.getUser(); // Get the current user (assuming your authHelper has this method)

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    // If the user's role is not in the allowedRoles array, redirect to the home page or an unauthorized page
    return <Navigate to='/' />;
  }

  // If the user has the right role, allow them to access the route
  return <>{children}</>;
}

export default ProtectedRoute;
