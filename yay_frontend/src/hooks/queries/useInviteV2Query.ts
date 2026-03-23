import { useQuery } from '@tanstack/react-query';
import { API_INVITES } from '../../constants';
import { queryKeysV2 } from '../queryKeys';
import useFetchWithAuth from '../useFetchWithAuth';
import type { InviteResponseV2 } from '../../types';

export function useInviteV2Query(communityId: number | null) {
  const fetchWithAuth = useFetchWithAuth();

  return useQuery<InviteResponseV2>({
    queryKey: queryKeysV2.invites.byCommunity(communityId as number),
    queryFn: () => getInvite(fetchWithAuth, communityId as number),
    enabled: !!communityId,
  });
}

async function getInvite(
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
  communityId: number,
) {
  const response = await fetchWithAuth(
    `${API_INVITES}?communityId=${communityId}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch invite (V2): ${response.status}`);
  }

  return response.json();
}
