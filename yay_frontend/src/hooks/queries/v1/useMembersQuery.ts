import { useQuery } from '@tanstack/react-query';
import useFetchWithAuth from '../../useFetchWithAuth';
import { queryKeysV1 } from '../../queryKeys';
import { API_COMMUNITIES_V1 } from '../../../constants';
import type { Member } from '../../../types/v1/Member';

export default function useMembersQuery(communityId: number | null) {
  const fetchWithAuth = useFetchWithAuth();

  return useQuery<Array<Member>>({
    queryKey: queryKeysV1.communities.members.detail(communityId!),
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${API_COMMUNITIES_V1}/${communityId}/members`,
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
