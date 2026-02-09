import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import useFetchWithAuth from './useFetchWithAuth';
import { API_COMMUNITIES } from '../constants';

type CommunityInviteSlug = {
  inviteSlug: string;
};

export function useCommunityInviteQuery(communityId: number | null) {
  const fetchWithAuth = useFetchWithAuth();

  const query = useQuery<CommunityInviteSlug>({
    queryKey: queryKeys.communities.invites.detail(communityId!),
    queryFn: () => getCommunityInvite(communityId!, fetchWithAuth),
    enabled: communityId !== null,
    staleTime: Infinity, // Consider seeding the cache for this in the future
    // gcTime: Infinity,
  });

  return query;
}

async function getCommunityInvite(
  communityId: number,
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
) {
  const response = await fetchWithAuth(
    `${API_COMMUNITIES}/${communityId}/invites`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
