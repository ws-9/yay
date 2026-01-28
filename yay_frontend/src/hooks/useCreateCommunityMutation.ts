import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getTokenState } from '../store/authStore';
import { useUserInfoQuery } from './useUserInfoQuery';
import type { Community } from '../types/Community';
import type { CommunityRole } from '../types/CommunityRole';
import { API_COMMUNITIES } from '../constants';

type CreateCommunityInput = {
  name: string;
};

type CreateCommunityResponse = {
  id: number;
  name: string;
  ownerId: number;
  ownerUsername: string;
  role: CommunityRole;
};

function useCreateCommunityMutation() {
  const queryClient = useQueryClient();
  const { token } = getTokenState();
  const { data: userInfo } = useUserInfoQuery();

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
    onSuccess: newCommunity => {
      // Optimistically update the my-communities cache
      queryClient.setQueryData(
        ['communities', 'my-communities'],
        (old: Community[] | undefined) => {
          if (!old) {
            return [
              {
                id: newCommunity.id,
                name: newCommunity.name,
                ownerId: newCommunity.ownerId,
                ownerUsername: newCommunity.ownerUsername,
                role: newCommunity.role,
                channels: [],
              },
            ];
          }
          return [
            ...old,
            {
              id: newCommunity.id,
              name: newCommunity.name,
              ownerId: newCommunity.ownerId,
              ownerUsername: newCommunity.ownerUsername,
              role: newCommunity.role,
              channels: [],
            },
          ];
        },
      );
      // Also update the individual community cache
      queryClient.setQueryData(['communities', newCommunity.id], {
        id: newCommunity.id,
        name: newCommunity.name,
        ownerId: newCommunity.ownerId,
        ownerUsername: newCommunity.ownerUsername,
        role: newCommunity.role,
        channels: [],
      });
      // Also update the member role cache for current user in this community
      if (userInfo?.id) {
        queryClient.setQueryData(
          ['communities', newCommunity.id, 'members', userInfo.id, 'role'],
          newCommunity.role,
        );
      }
    },
  });
}

export default function useCreateCommunity() {
  return useCreateCommunityMutation();
}
