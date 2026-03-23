import { useMutation } from '@tanstack/react-query';
import { API_CHANNELS_V1 } from '../../../constants';
import { useCreateChannelOptimistically } from '../../cacheHelpers';
import useFetchWithAuth from '../../useFetchWithAuth';

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
  const fetchWithAuth = useFetchWithAuth();
  const createChannelOptimistically = useCreateChannelOptimistically();

  return useMutation<CreateChannelResponse, Error, CreateChannelInput>({
    mutationFn: async function (data) {
      const response = await fetchWithAuth(API_CHANNELS_V1, {
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
      createChannelOptimistically(newChannel);
    },
  });
}

export default function useCreateChannel() {
  return useCreateChannelMutation();
}
