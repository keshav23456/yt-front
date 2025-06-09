import { useAuthContext } from '../contexts/AuthContext.jsx';

// Custom hook that wraps the auth context
export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;