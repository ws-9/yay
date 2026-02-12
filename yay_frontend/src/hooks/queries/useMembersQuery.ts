import { useQuery } from '@tanstack/react-query';
import useFetchWithAuth from '../useFetchWithAuth';
import { queryKeys } from '../queryKeys';
import { API_COMMUNITIES } from '../../constants';
import type { Member } from '../../types/Member';

export default function useMembersQuery(communityId: number | null) {
  const fetchWithAuth = useFetchWithAuth();

  return useQuery<Array<Member>>({
    queryKey: queryKeys.communities.members.detail(communityId!),
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${API_COMMUNITIES}/${communityId}/members`,
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
    },
    enabled: communityId !== null,
  });
}
