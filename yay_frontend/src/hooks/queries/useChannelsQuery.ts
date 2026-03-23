import { useQuery } from '@tanstack/react-query';
import { API_CHANNELS } from '../../constants';
import { queryKeysV2 } from '../queryKeys';
import useFetchWithAuth from '../useFetchWithAuth';
import type { Channel } from '../../types';

export function useChannelsQuery(communityIds: number[]) {
  const fetchWithAuth = useFetchWithAuth();

  return useQuery<Channel[]>({
    queryKey: queryKeysV2.channels.byCommunity(communityIds),
    queryFn: () => getChannelsByCommunities(fetchWithAuth, communityIds),
    enabled: communityIds.length > 0,
  });
}

async function getChannelsByCommunities(
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
  communityIds: number[],
) {
  const idsParam = communityIds.join(',');
  const response = await fetchWithAuth(
    `${API_CHANNELS}?communityIds=${idsParam}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch channels (V2): ${response.status}`);
  }

  return response.json();
}
