import { useQuery } from '@tanstack/react-query';
import { API_CHANNELS } from '../constants';
import { useTokenState } from '../store/authStore';
import type { Channel } from '../types/Channel';

export function useChannelQuery(selectedChannel: number | null) {
  const { token } = useTokenState();

  const query = useQuery<Channel>({
    queryKey: ['channels', { selectedChannel }],
    queryFn: () => getChannel(selectedChannel!, token!),
    enabled: selectedChannel !== null && token !== null,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

async function getChannel(selectedChannel: number, token: string) {
  const response = await fetch(`${API_CHANNELS}/${selectedChannel}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
