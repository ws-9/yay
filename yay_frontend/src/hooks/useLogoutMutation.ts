import { useMutation } from '@tanstack/react-query';
import { useAuthActions } from '../store/authStore';
import { API_LOGOUT_URL } from '../constants';

function useLogoutMutation() {
  const { logout } = useAuthActions();

  return useMutation<void, Error, void>({
    mutationFn: async function () {
      const response = await fetch(API_LOGOUT_URL, {
        method: 'POST',
        credentials: 'include', // Include cookies for logout
      });

      if (!response.ok) {
        // Even if logout fails on server, clear local state
        console.warn('Logout failed on server, but clearing local state');
      }
    },
    onSuccess: () => {
      logout();
    },
    onSettled: () => {
      // Always clear local state, even on error
      logout();
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
