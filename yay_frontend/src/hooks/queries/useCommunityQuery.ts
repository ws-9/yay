import { useQuery } from '@tanstack/react-query';
import { API_COMMUNITIES } from '../../constants';
import type { Community } from '../../types/Community';
import { queryKeys } from '../queryKeys';
import useFetchWithAuth from '../useFetchWithAuth';

export function useCommunityQuery(communityId: number | null) {
  const fetchWithAuth = useFetchWithAuth();

  const query = useQuery<Community>({
    queryKey: queryKeys.communities.detail(communityId!),
    queryFn: () => getCommunity(communityId!, fetchWithAuth),
    enabled: communityId !== null,
    staleTime: Infinity, // Always use cache, never auto-refetch
    gcTime: Infinity, // Keep cache permanently
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

async function getCommunity(
  communityId: number,
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
) {
  const response = await fetchWithAuth(`${API_COMMUNITIES}/${communityId}`, {
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
