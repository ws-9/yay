import { useQuery } from '@tanstack/react-query';
import { API_CHANNELS } from '../../constants';
import type { Channel } from '../../types/Channel';
import { queryKeys } from '../queryKeys';
import useFetchWithAuth from '../useFetchWithAuth';

export function useChannelQuery(channelId: number | null) {
  const fetchWithAuth = useFetchWithAuth();

  const query = useQuery<Channel>({
    queryKey: queryKeys.channels.detail(channelId!),
    queryFn: async () => {
      const response = await fetchWithAuth(`${API_CHANNELS}/${channelId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      return response.json();
    },
    enabled: channelId !== null,
    staleTime: Infinity, // Always use cache, never auto-refetch
    gcTime: Infinity, // Keep cache permanently
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
