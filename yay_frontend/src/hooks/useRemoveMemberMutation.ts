import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getTokenState } from '../store/authStore';
import { API_MEMBERS } from '../constants';
import { useUserInfoQuery } from './useUserInfoQuery';
import { useRemoveCommunityOptimistically } from './cacheHelpers';
import { queryKeys } from './queryKeys';

type RemoveMemberInput = {
  communityId: number;
  userId: number;
};

function useRemoveMemberMutation() {
  const queryClient = useQueryClient();
  const { token } = getTokenState();
  const { data: userInfo } = useUserInfoQuery();
  const removeCommunityOptimistically = useRemoveCommunityOptimistically();

  return useMutation<void, Error, RemoveMemberInput>({
    mutationFn: async function (data) {
      const response = await fetch(API_MEMBERS, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
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
        // Otherwise, invalidate bootstrap to refetch
        await queryClient.invalidateQueries({
          queryKey: queryKeys.bootstrap,
        });
      }
    },
  });
}

export default function useRemoveMember() {
  return useRemoveMemberMutation();
}
