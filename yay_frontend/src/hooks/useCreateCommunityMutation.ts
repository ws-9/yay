import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getTokenState } from '../store/authStore';
import { API_COMMUNITIES } from '../constants';

type CreateCommunityInput = {
  name: string;
};

type CreateCommunityResponse = {
  id: number;
  name: string;
  ownerId: number;
  ownerUsername: string;
};

function useCreateCommunityMutation() {
  const queryClient = useQueryClient();
  const { token } = getTokenState();

  return useMutation<CreateCommunityResponse, Error, CreateCommunityInput>({
    mutationFn: async function (data) {
      const response = await fetch(API_COMMUNITIES, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(json));
      }

      return json;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['communities', 'my-communities'],
      });
    },
  });
}

export default function useCreateCommunity() {
  return useCreateCommunityMutation();
}
