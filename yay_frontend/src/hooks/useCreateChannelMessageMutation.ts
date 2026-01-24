import { useMutation } from '@tanstack/react-query';
import { getTokenState } from '../store/authStore';
import type { ChannelMessage } from '../types/ChannelMessage';
import { API_MESSAGES } from '../constants';

type CreateChannelMessageInput = {
  channelId: number;
  message: string;
};

function useCreateChannelMessageMutation() {
  const { token } = getTokenState();

  return useMutation<ChannelMessage, Error, CreateChannelMessageInput>({
    mutationFn: async function (data) {
      // Artificial 2-second delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const response = await fetch(API_MESSAGES, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
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
