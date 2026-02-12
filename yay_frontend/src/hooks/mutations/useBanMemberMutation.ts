import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BANS } from '../../constants';
import { queryKeys } from '../queryKeys';
import useFetchWithAuth from '../useFetchWithAuth';

type BanMemberInput = {
  communityId: number;
  userId: number;
};

type BannedUserResponse = {
  userId: number;
  username: string;
  communityId: number;
  communityName: string;
};

function useBanMemberMutation() {
  const fetchWithAuth = useFetchWithAuth();
  const queryClient = useQueryClient();

  return useMutation<BannedUserResponse, Error, BanMemberInput>({
    mutationFn: async function (data) {
      const response = await fetchWithAuth(API_BANS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Community or user not found');
        }
        const json = await response.json();
        throw new Error(JSON.stringify(json));
      }

      return response.json();
    },
    onSuccess: async (_, variables) => {
      // Optimistically set the banned user's role to null
      queryClient.setQueryData(
        queryKeys.communities.members.role(
          variables.communityId,
          variables.userId,
        ),
        null,
      );
    },
  });
}

export default function useBanMember() {
  return useBanMemberMutation();
}
