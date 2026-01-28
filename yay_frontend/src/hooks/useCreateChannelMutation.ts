import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getTokenState } from '../store/authStore';
import type { Community } from '../types/Community';
import { API_CHANNELS } from '../constants';

type CreateChannelInput = {
  communityId: number;
  name: string;
};

type CreateChannelResponse = {
  id: number;
  name: string;
  communityId: number;
  communityName: string;
};

function useCreateChannelMutation() {
  const queryClient = useQueryClient();
  const { token } = getTokenState();

  return useMutation<CreateChannelResponse, Error, CreateChannelInput>({
    mutationFn: async function (data) {
      const response = await fetch(API_CHANNELS, {
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
    onSuccess: newChannel => {
      // Optimistically update the communities cache
      queryClient.setQueryData(
        ['communities', 'my-communities'],
        (old: Community[] | undefined) => {
          if (!old) {
            return [newChannel];
          }
          // Find the community and add the channel to it
          return old.map(community => {
            if (community.id === newChannel.communityId) {
              return {
                ...community,
                channels: [
                  ...(community.channels || []),
                  {
                    id: newChannel.id,
                    name: newChannel.name,
                    communityId: newChannel.communityId,
                    communityName: newChannel.communityName,
                  },
                ],
              };
            }
            return community;
          });
        },
      );
      // Also update the individual community cache
      queryClient.setQueryData(
        ['communities', newChannel.communityId],
        (old: Community | undefined) => {
          if (!old) {
            return old;
          }
          return {
            ...old,
            channels: [
              ...(old.channels || []),
              {
                id: newChannel.id,
                name: newChannel.name,
                communityId: newChannel.communityId,
                communityName: newChannel.communityName,
              },
            ],
          };
        },
      );
    },
  });
}

export default function useCreateChannel() {
  return useCreateChannelMutation();
}
