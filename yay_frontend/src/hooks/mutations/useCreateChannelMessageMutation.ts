import { useMutation } from '@tanstack/react-query';
import type { ChannelMessage } from '../../types/ChannelMessage';
import { API_MESSAGES } from '../../constants';
import useFetchWithAuth from '../useFetchWithAuth';

type CreateChannelMessageInput = {
  channelId: number;
  message: string;
};

function useCreateChannelMessageMutation() {
  const fetchWithAuth = useFetchWithAuth();

  return useMutation<ChannelMessage, Error, CreateChannelMessageInput>({
    mutationFn: async function (data) {
      const response = await fetchWithAuth(API_MESSAGES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: data.message,
          channelId: data.channelId,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(json));
      }

      return json;
    },
  });
}

export default function useCreateChannelMessage() {
  return useCreateChannelMessageMutation();
}
