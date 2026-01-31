import { useQuery } from '@tanstack/react-query';
import { API_ME } from '../constants';
import { queryKeys } from './queryKeys';
import useFetchWithAuth from './useFetchWithAuth';

export type UserInfoResponse = {
  username: string;
  id: number;
};

export function useUserInfoQuery() {
  const fetchWithAuth = useFetchWithAuth();

  const query = useQuery<UserInfoResponse>({
    queryKey: queryKeys.me,
    queryFn: () => getMe(fetchWithAuth),
    staleTime: Infinity, // Always use cache, never auto-refetch
    gcTime: Infinity, // Keep cache permanently
  });

  return query;
}

async function getMe(
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
) {
  const response = await fetchWithAuth(API_ME, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
