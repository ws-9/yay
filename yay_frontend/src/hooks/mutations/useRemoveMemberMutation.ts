import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_MEMBERS } from '../../constants';
import { useMeQuery } from '../queries/useMeQuery';
import { queryKeysV2 } from '../queryKeys';
import useFetchWithAuth from '../useFetchWithAuth';

type RemoveMemberInput = {
  communityId: number;
  userId: number;
};

function useRemoveMemberMutation() {
  const fetchWithAuth = useFetchWithAuth();
  const queryClient = useQueryClient();
  const { data: userInfo } = useMeQuery();

  return useMutation<void, Error, RemoveMemberInput>({
    mutationFn: async function (data) {
      const response = await fetchWithAuth(
        `${API_MEMBERS}/${data.communityId}/${data.userId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Member or community not found');
        }
        const json = await response.json();
        throw new Error(JSON.stringify(json));
      }
    },
    onSuccess: async (_, variables) => {
      if (variables.userId === userInfo?.id) {
        // If removing self, invalidate bootstrap to remove community from list
        await queryClient.invalidateQueries({
          queryKey: queryKeysV2.bootstrap,
        });
      } else {
        // Invalidate member list and detail
        queryClient.invalidateQueries({
          queryKey: queryKeysV2.members.byCommunity(variables.communityId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeysV2.members.detail(
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
