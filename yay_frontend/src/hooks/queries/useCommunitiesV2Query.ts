import { useQuery } from '@tanstack/react-query';
import { API_COMMUNITIES } from '../../constants';
import { queryKeysV2 } from '../queryKeys';
import useFetchWithAuth from '../useFetchWithAuth';
import type { CommunityV2 } from '../../types';

export function useCommunitiesV2Query() {
  const fetchWithAuth = useFetchWithAuth();

  return useQuery<CommunityV2[]>({
    queryKey: queryKeysV2.communities.joined,
    queryFn: () => getJoinedCommunities(fetchWithAuth),
  });
}

async function getJoinedCommunities(
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
) {
  const response = await fetchWithAuth(`${API_COMMUNITIES}?joined=true`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch joined communities (V2): ${response.status}`,
    );
  }

  return response.json();
}
