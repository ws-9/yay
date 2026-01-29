import { useMutation } from '@tanstack/react-query';
import { getTokenState } from '../store/authStore';
import { API_MESSAGES } from '../constants';

type DeleteChannelMessageInput = {
  id: number;
};

function useDeleteChannelMessageMutation() {
  const { token } = getTokenState();

  return useMutation<void, Error, DeleteChannelMessageInput>({
    mutationFn: async function (data) {
      const response = await fetch(API_MESSAGES, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: data.id,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      // 204 No Content - no body to parse
      return;
    },
  });
}

export default function useDeleteChannelMessage() {
  return useDeleteChannelMessageMutation();
}
