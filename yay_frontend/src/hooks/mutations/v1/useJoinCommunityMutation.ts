import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_MEMBERS_V1 } from '../../../constants';
import { queryKeysV1 } from '../../queryKeys';
import useFetchWithAuth from '../../useFetchWithAuth';

type JoinCommunityInput = {
  inviteSlug: string;
};

type JoinCommunityResponse = {
  memberId: number;
  memberUsername: string;
  isNewMember: boolean;
};

function useJoinCommunityMutation() {
  const fetchWithAuth = useFetchWithAuth();
  const queryClient = useQueryClient();

  return useMutation<JoinCommunityResponse, Error, JoinCommunityInput>({
    mutationFn: async function (data) {
      const response = await fetchWithAuth(API_MEMBERS_V1, {
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
    onSuccess: async data => {
      if (data.isNewMember) {
        await queryClient.invalidateQueries({
          queryKey: queryKeysV1.bootstrap,
        });
      }
    },
  });
}

export default function useJoinCommunity() {
  return useJoinCommunityMutation();
}
