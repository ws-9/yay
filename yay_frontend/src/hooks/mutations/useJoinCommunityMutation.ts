import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_MEMBERS } from '../../constants';
import { queryKeysV2 } from '../queryKeys';
import useFetchWithAuth from '../useFetchWithAuth';
import type { Member } from '../../types/Member';

type JoinCommunityInput = {
  inviteSlug: string;
};

function useJoinCommunityMutation() {
  const fetchWithAuth = useFetchWithAuth();
  const queryClient = useQueryClient();

  return useMutation<Member, Error, JoinCommunityInput>({
    mutationFn: async function (data) {
      const response = await fetchWithAuth(API_MEMBERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Community not found');
        }
        if (response.status === 403) {
          throw new Error('You are banned from this community');
        }
        const json = await response.json();
        throw new Error(JSON.stringify(json));
      }

      return response.json();
    },
    onSuccess: async () => {
      // Invalidate bootstrap to get the new community
      await queryClient.invalidateQueries({
        queryKey: queryKeysV2.bootstrap,
      });
    },
  });
}

export default function useJoinCommunity() {
  return useJoinCommunityMutation();
}
