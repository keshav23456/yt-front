import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

// Custom hook for API calls with loading states and error handling
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { refreshToken, logout } = useAuth();

  const makeRequest = useCallback(async (apiCall, options = {}) => {
    const { 
      showLoading = true,
      onSuccess,
      onError,
      retryOnAuthError = true
    } = options;

    try {
      if (showLoading) setLoading(true);
      setError(null);

      const response = await apiCall();

      if (response.success) {
        onSuccess?.(response.data);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Request failed');
      }
    } catch (err) {
      // Handle authentication errors
      if (err.status === 401 && retryOnAuthError) {
        try {
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            // Retry the original request
            const retryResponse = await apiCall();
            if (retryResponse.success) {
              onSuccess?.(retryResponse.data);
              return { success: true, data: retryResponse.data };
            }
          } else {
            // Refresh failed, logout user
            logout();
            return { success: false, error: 'Session expired. Please login again.' };
          }
        } catch (refreshError) {
          logout();
          return { success: false, error: 'Session expired. Please login again.' };
        }
      }

      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [refreshToken, logout]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    makeRequest,
    clearError
  };
};

export default useApi;