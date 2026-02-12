import { useMutation } from '@tanstack/react-query';
import { API_MESSAGES } from '../../constants';
import type { ChannelMessage } from '../../types/ChannelMessage';
import useFetchWithAuth from '../useFetchWithAuth';

type EditChannelMessageInput = {
  id: number;
  message: string;
};

function useEditChannelMessageMutation() {
  const fetchWithAuth = useFetchWithAuth();

  return useMutation<ChannelMessage, Error, EditChannelMessageInput>({
    mutationFn: async function (data) {
      const response = await fetchWithAuth(API_MESSAGES, {
        method: 'PUT',
        headers: {
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
