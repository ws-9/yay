import { useQuery } from '@tanstack/react-query';
import { API_COMMUNITIES } from '../../constants';
import { queryKeysV2 } from '../queryKeys';
import useFetchWithAuth from '../useFetchWithAuth';
import type { Community } from '../../types';

export function useCommunityQuery(id: number | null) {
  const fetchWithAuth = useFetchWithAuth();

  return useQuery<Community>({
    queryKey: queryKeysV2.communities.detail(id as number),
    queryFn: () => getCommunity(fetchWithAuth, id as number),
    enabled: !!id,
  });
}

async function getCommunity(
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
  id: number,
) {
  const response = await fetchWithAuth(`${API_COMMUNITIES}/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch community (V2): ${response.status}`);
  }

  return response.json();
}
