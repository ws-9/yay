import { useAuthActions, getTokenState } from '../store/authStore';
import { useNavigate } from 'react-router';
import { API_REFRESH_URL } from '../constants';

async function refreshToken() {
  const response = await fetch(API_REFRESH_URL, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  return data.jwtToken;
}

/**
 * A hook that returns a fetch function with automatic bearer token inclusion and refresh on 401 or no token.
 */
export default function useFetchWithAuth() {
  const { login, logout } = useAuthActions();
  const navigate = useNavigate();

  return async function (url: string, options: RequestInit = {}) {
    let currentToken = getTokenState().token;

    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${currentToken}`);

    let response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      try {
        const newToken = await refreshToken();
        login(newToken);
        currentToken = newToken;
        headers.set('Authorization', `Bearer ${currentToken}`);
        response = await fetch(url, {
          ...options,
          headers,
        });
      } catch (error) {
        logout();
        navigate('/login');
        throw error;
      }
    }

    return response;
  };
}
