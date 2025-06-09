import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../common/Loading';

const ProtectedRoute = ({ 
  children, 
  redirectTo = '/auth/login',
  requiredPermissions = [],
  fallbackComponent = null 
}) => {
  const { 
    isAuthenticated, 
    isLoading, 
    isInitialized, 
    user, 
    error,
    checkAuthStatus 
  } = useAuth();
  const location = useLocation();

  // Re-check auth status if there's an error
  useEffect(() => {
    if (error && !isLoading && !isAuthenticated) {
      checkAuthStatus();
    }
  }, [error, isLoading, isAuthenticated, checkAuthStatus]);

  // Show loading while authentication is being determined
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loading size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname + location.search }}
        replace 
      />
    );
  }

  // Check for required permissions if specified
  if (requiredPermissions.length > 0 && user) {
    const hasPermission = requiredPermissions.every(permission => {
      // Check if user has the required permission
      // This assumes user.permissions is an array or user.role has permissions
      if (user.permissions && Array.isArray(user.permissions)) {
        return user.permissions.includes(permission);
      }
      
      // Check role-based permissions
      if (user.role && user.role.permissions) {
        return user.role.permissions.includes(permission);
      }
      
      // Default role-based check
      if (permission === 'admin' && user.role !== 'admin') {
        return false;
      }
      
      return true;
    });

    if (!hasPermission) {
      // Return fallback component or redirect to unauthorized page
      if (fallbackComponent) {
        return fallbackComponent;
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You don't have permission to access this page.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  // Render children or Outlet for nested routes
  return children || <Outlet />;
};

// Higher-order component version for class components
export const withProtectedRoute = (Component, options = {}) => {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

// Hook for checking authentication in components
export const useProtectedRoute = (requiredPermissions = []) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  const hasPermission = React.useMemo(() => {
    if (!isAuthenticated || !user) return false;
    
    if (requiredPermissions.length === 0) return true;
    
    return requiredPermissions.every(permission => {
      if (user.permissions && Array.isArray(user.permissions)) {
        return user.permissions.includes(permission);
      }
      
      if (user.role && user.role.permissions) {
        return user.role.permissions.includes(permission);
      }
      
      if (permission === 'admin' && user.role !== 'admin') {
        return false;
      }
      
      return true;
    });
  }, [isAuthenticated, user, requiredPermissions]);

  return {
    isAuthenticated,
    hasPermission,
    isLoading,
    user,
    currentPath: location.pathname
  };
};

export default ProtectedRoute;