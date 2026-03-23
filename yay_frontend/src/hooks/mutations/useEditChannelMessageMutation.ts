import { useMutation } from '@tanstack/react-query';
import { API_MESSAGES } from '../../constants';
import type { MessageV2 } from '../../types/MessageV2';
import useFetchWithAuth from '../useFetchWithAuth';

type EditChannelMessageInput = {
  id: number;
  message: string;
};

function useEditChannelMessageMutation() {
  const fetchWithAuth = useFetchWithAuth();

  return useMutation<MessageV2, Error, EditChannelMessageInput>({
    mutationFn: async function (data) {
      const response = await fetchWithAuth(`${API_MESSAGES}/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
