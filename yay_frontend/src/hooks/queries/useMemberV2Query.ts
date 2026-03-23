import { useQuery } from '@tanstack/react-query';
import { API_MEMBERS } from '../../constants';
import { queryKeysV2 } from '../queryKeys';
import useFetchWithAuth from '../useFetchWithAuth';
import type { MemberV2 } from '../../types';

export function useMemberV2Query(
  communityId: number | null,
  userId: number | null,
) {
  const fetchWithAuth = useFetchWithAuth();

  return useQuery<MemberV2[]>({
    queryKey: queryKeysV2.members.detail(communityId ?? 0, userId ?? 0),
    queryFn: () =>
      getMember(fetchWithAuth, communityId as number, userId as number),
    enabled: !!communityId && !!userId,
  });
}

async function getMember(
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
  communityId: number,
  userId: number,
) {
  const url = `${API_MEMBERS}?communityId=${communityId}&userId=${userId}`;
  const response = await fetchWithAuth(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch member (V2): ${response.status}`);
  }

  return response.json();
}
