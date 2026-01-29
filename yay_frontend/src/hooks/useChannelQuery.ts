import { useQuery } from '@tanstack/react-query';
import { API_CHANNELS } from '../constants';
import { getTokenState } from '../store/authStore';
import type { Channel } from '../types/Channel';
import { queryKeys } from './queryKeys';

export function useChannelQuery(channelId: number | null) {
  const { token } = getTokenState();

  const query = useQuery<Channel>({
    queryKey: queryKeys.channels.detail(channelId!),
    queryFn: () => getChannel(channelId!, token!),
    enabled: channelId !== null && token !== null,
    staleTime: Infinity, // Always use cache, never auto-refetch
    gcTime: Infinity, // Keep cache permanently
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

async function getChannel(channelId: number, token: string) {
  const response = await fetch(`${API_CHANNELS}/${channelId}`, {
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
