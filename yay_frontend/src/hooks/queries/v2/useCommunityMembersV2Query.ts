import { useQuery } from '@tanstack/react-query';
import { API_MEMBERS_V2 } from '../../../constants';
import { queryKeysV2 } from '../../queryKeys';
import useFetchWithAuth from '../../useFetchWithAuth';
import type { MemberV2 } from '../../../types/v2';

export function useCommunityMembersV2Query(communityId: number) {
  const fetchWithAuth = useFetchWithAuth();

  return useQuery<MemberV2[]>({
    queryKey: queryKeysV2.members.byCommunity(communityId),
    queryFn: () => getCommunityMembers(fetchWithAuth, communityId),
    enabled: !!communityId,
  });
}

async function getCommunityMembers(
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
  communityId: number,
) {
  const response = await fetchWithAuth(
    `${API_MEMBERS_V2}?communityId=${communityId}`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch community members (V2): ${response.status}`,
    );
  }

  return response.json();
}
