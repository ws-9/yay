import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_CHANNELS } from '../../constants';
import { queryKeysV2 } from '../queryKeys';
import useFetchWithAuth from '../useFetchWithAuth';
import type { ChannelV2 } from '../../types/ChannelV2';

type CreateChannelInput = {
  communityId: number;
  name: string;
};

function useCreateChannelMutation() {
  const fetchWithAuth = useFetchWithAuth();
  const queryClient = useQueryClient();

  return useMutation<ChannelV2, Error, CreateChannelInput>({
    mutationFn: async function (data) {
      const response = await fetchWithAuth(API_CHANNELS, {
        method: 'POST',
        headers: {
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
      // Invalidate the channel list for this community
      queryClient.invalidateQueries({
        queryKey: queryKeysV2.channels.byCommunity([newChannel.communityId]),
      });
      // Set individual channel cache
      queryClient.setQueryData(
        queryKeysV2.channels.detail(newChannel.id),
        newChannel,
      );
    },
  });
}

export default function useCreateChannel() {
  return useCreateChannelMutation();
}
