import { useQuery } from '@tanstack/react-query';
import { API_ME } from '../../constants';
import { queryKeysV2 } from '../queryKeys';
import useFetchWithAuth from '../useFetchWithAuth';
import type { User } from '../../types';

export function useMeQuery() {
  const fetchWithAuth = useFetchWithAuth();

  return useQuery<User>({
    queryKey: queryKeysV2.me,
    queryFn: () => getMe(fetchWithAuth),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

async function getMe(
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
) {
  const response = await fetchWithAuth(API_ME);

  if (!response.ok) {
    throw new Error(`Failed to fetch me (V2): ${response.status}`);
  }

  return response.json();
}
