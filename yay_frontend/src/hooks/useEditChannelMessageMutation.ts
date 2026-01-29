import { useMutation } from '@tanstack/react-query';
import { getTokenState } from '../store/authStore';
import { API_MESSAGES } from '../constants';
import type { ChannelMessage } from '../types/ChannelMessage';

type EditChannelMessageInput = {
  id: number;
  message: string;
};

function useEditChannelMessageMutation() {
  const { token } = getTokenState();

  return useMutation<ChannelMessage, Error, EditChannelMessageInput>({
    mutationFn: async function (data) {
      const response = await fetch(API_MESSAGES, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: data.id,
          message: data.message,
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

export default function useEditChannelMessage() {
  return useEditChannelMessageMutation();
}
