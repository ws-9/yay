import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getTokenState } from '../store/authStore';
import { API_MEMBERS } from '../constants';

type RemoveMemberInput = {
  communityId: number;
  userId: number;
};

function useRemoveMemberMutation() {
  const queryClient = useQueryClient();
  const { token } = getTokenState();

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
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['communities', 'my-communities'],
      });
    },
  });
}

export default function useRemoveMember() {
  return useRemoveMemberMutation();
}
