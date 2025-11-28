import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loginUser } from '../api/auth';

const USER_QUERY_KEY = ['user'];

// Hook to get current user state
export const useUser = () => {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: () => null,
    staleTime: Infinity,
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
        // Store only token in localStorage
        localStorage.setItem('access_token', data.data.access_token);

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
    queryClient.setQueryData(USER_QUERY_KEY, null);
  };
};
