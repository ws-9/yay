import { useQuery } from '@tanstack/react-query';
import { API_COMMUNITIES_V2 } from '../../../constants';
import { queryKeysV2 } from '../../queryKeys';
import useFetchWithAuth from '../../useFetchWithAuth';
import type { CommunityV2 } from '../../../types/v2';

export function useCommunityV2Query(id: number | null) {
  const fetchWithAuth = useFetchWithAuth();

  return useQuery<CommunityV2>({
    queryKey: queryKeysV2.communities.detail(id as number),
    queryFn: () => getCommunity(fetchWithAuth, id as number),
    enabled: !!id,
  });
}

async function getCommunity(
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
  id: number,
) {
  const response = await fetchWithAuth(`${API_COMMUNITIES_V2}/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch community (V2): ${response.status}`);
  }

  return response.json();
}
