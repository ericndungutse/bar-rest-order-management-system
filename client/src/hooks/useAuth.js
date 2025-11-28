import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loginUser } from '../api/auth';

const USER_QUERY_KEY = ['user'];

// Helper function to get initial user from localStorage
const getStoredUser = () => {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('access_token');
  if (storedUser && storedToken) {
    return {
      user: JSON.parse(storedUser),
      access_token: storedToken,
    };
  }
  return null;
};

// Hook to get current user state
export const useUser = () => {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: () => getStoredUser(),
    staleTime: Infinity,
    initialData: getStoredUser,
  });
};

// Hook for login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Validate response structure
      if (data.data?.access_token && data.data?.user) {
        // Store in localStorage
        localStorage.setItem('access_token', data.data.access_token);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        // Update query cache with user data
        queryClient.setQueryData(USER_QUERY_KEY, {
          user: data.data.user,
          access_token: data.data.access_token,
        });
      }
    },
  });
};

// Hook for logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    queryClient.setQueryData(USER_QUERY_KEY, null);
  };
};
