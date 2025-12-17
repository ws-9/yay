import { useQuery } from '@tanstack/react-query';
import { API_COMMUNITY } from '../constants';
import { useTokenState } from '../store/authStore';
import type { Channel } from '../types/Channel';

export function useChannelQuery(selectedChannel: number | null) {
  const { token } = useTokenState();

  const query = useQuery<Channel>({
    queryKey: ['channels', { selectedChannel }],
    queryFn: () => getChannel(selectedChannel, token),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

async function getChannel(
  selectedChannel: number | null,
  token: string | null,
) {
  const response = await fetch(`${API_COMMUNITY}/${selectedChannel}`, {
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
