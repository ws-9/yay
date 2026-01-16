import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getTokenState } from '../store/authStore';
import { API_MEMBERS } from '../constants';

type JoinCommunityInput = {
  communityId: number;
};

type JoinCommunityResponse = {
  memberId: number;
  memberUsername: string;
  isNewMember: boolean;
};

function useJoinCommunityMutation() {
  const queryClient = useQueryClient();
  const { token } = getTokenState();

  return useMutation<JoinCommunityResponse, Error, JoinCommunityInput>({
    mutationFn: async function (data) {
      const response = await fetch(API_MEMBERS, {
        method: 'POST',
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

      return response.json();
    },
    onSuccess: async data => {
      if (data.isNewMember) {
        await queryClient.invalidateQueries({
          queryKey: ['communities', 'my-communities'],
        });
      }
    },
  });
}

export default function useJoinCommunity() {
  return useJoinCommunityMutation();
}
