import { useQuery } from '@tanstack/react-query';
import { API_COMMUNITIES } from '../constants';
import { getTokenState } from '../store/authStore';
import type { Community } from '../types/Community';

export function useCommunityQuery(communityId: number | null) {
  const { token } = getTokenState();

  const query = useQuery<Community>({
    queryKey: ['communities', communityId],
    queryFn: () => getCommunity(communityId!, token!),
    enabled: communityId !== null && token !== null,
    staleTime: Infinity, // Always use cache, never auto-refetch
    gcTime: Infinity, // Keep cache permanently
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

async function getCommunity(communityId: number, token: string) {
  const response = await fetch(`${API_COMMUNITIES}/${communityId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
