import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useAuthActions } from '../store/authStore';
import { API_LOGOUT_URL } from '../constants';

function useLogoutMutation() {
  const { logout } = useAuthActions();
  const navigate = useNavigate();

  return useMutation<void, Error, void>({
    mutationFn: async function () {
      console.log('Calling logout endpoint...');
      const response = await fetch(API_LOGOUT_URL, {
        method: 'POST',
        credentials: 'include', // Include cookies for logout
      });

      console.log('Logout response status:', response.status);
      if (!response.ok) {
        // Even if logout fails on server, clear local state
        console.warn('Logout failed on server, but clearing local state');
      } else {
        console.log('Logout successful on server');
      }
    },
    onSuccess: () => {
      logout();
      navigate('/login');
    },
    onSettled: () => {
      // Always clear local state, even on error
      logout();
      navigate('/login');
    },
  });
}

export function useLogout() {
  const { mutate, isPending, error } = useLogoutMutation();

  function logout(): void {
    mutate();
  }

  return {
    logout,
    isPending,
    error,
  };
}
