import { useMutation } from '@tanstack/react-query';
import { API_MESSAGES } from '../../constants';
import useFetchWithAuth from '../useFetchWithAuth';

type DeleteChannelMessageInput = {
  id: number;
};

function useDeleteChannelMessageMutation() {
  const fetchWithAuth = useFetchWithAuth();

  return useMutation<void, Error, DeleteChannelMessageInput>({
    mutationFn: async function (data) {
      const response = await fetchWithAuth(`${API_MESSAGES}/${data.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
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
