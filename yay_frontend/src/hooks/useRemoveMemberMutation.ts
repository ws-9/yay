import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_MEMBERS } from '../constants';
import { useUserInfoQuery } from './useUserInfoQuery';
import { useRemoveCommunityOptimistically } from './cacheHelpers';
import { queryKeys } from './queryKeys';
import useFetchWithAuth from './useFetchWithAuth';

type RemoveMemberInput = {
  communityId: number;
  userId: number;
};

function useRemoveMemberMutation() {
  const fetchWithAuth = useFetchWithAuth();
  const queryClient = useQueryClient();
  const { data: userInfo } = useUserInfoQuery();
  const removeCommunityOptimistically = useRemoveCommunityOptimistically();

  return useMutation<void, Error, RemoveMemberInput>({
    mutationFn: async function (data) {
      const response = await fetchWithAuth(API_MEMBERS, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Community not found');
        }
        const json = await response.json();
        throw new Error(JSON.stringify(json));
      }
    },
    onSuccess: async (_, variables) => {
      if (variables.userId === userInfo?.id) {
        // If removing self, optimistically remove the community from bootstrap
        removeCommunityOptimistically(variables.communityId);
      } else {
        queryClient.invalidateQueries({
          queryKey: queryKeys.communities.members.role(
            variables.communityId,
            variables.userId,
          ),
        });
      }
    },
  });
}

export default function useRemoveMember() {
  return useRemoveMemberMutation();
}
