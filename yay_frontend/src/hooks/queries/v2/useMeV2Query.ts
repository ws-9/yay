import { useQuery } from '@tanstack/react-query';
import { API_ME_V2 } from '../../../constants';
import { queryKeysV2 } from '../../queryKeys';
import useFetchWithAuth from '../../useFetchWithAuth';
import type { UserV2 } from '../../../types/v2';

export function useMeV2Query() {
  const fetchWithAuth = useFetchWithAuth();

  return useQuery<UserV2>({
    queryKey: queryKeysV2.me,
    queryFn: () => getMe(fetchWithAuth),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

async function getMe(
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
) {
  const response = await fetchWithAuth(API_ME_V2);

  if (!response.ok) {
    throw new Error(`Failed to fetch me (V2): ${response.status}`);
  }

  return response.json();
}
