import { useAuthContext } from '../contexts/AuthContext';

// Custom hook that wraps the auth context
export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;