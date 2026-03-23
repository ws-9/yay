import { useQuery } from '@tanstack/react-query';
import { API_CHANNELS } from '../../constants';
import { queryKeysV2 } from '../queryKeys';
import useFetchWithAuth from '../useFetchWithAuth';
import type { ChannelV2 } from '../../types';

export function useChannelV2Query(id: number) {
  const fetchWithAuth = useFetchWithAuth();

  return useQuery<ChannelV2>({
    queryKey: queryKeysV2.channels.detail(id),
    queryFn: () => getChannel(fetchWithAuth, id),
    enabled: !!id,
  });
}

async function getChannel(
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
  id: number,
) {
  const response = await fetchWithAuth(`${API_CHANNELS}/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch channel (V2): ${response.status}`);
  }

  return response.json();
}
