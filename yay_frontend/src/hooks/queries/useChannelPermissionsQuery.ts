import { useQuery } from '@tanstack/react-query';
import { API_CHANNEL_PERMISSIONS } from '../../constants';
import { queryKeysV2 } from '../queryKeys';
import useFetchWithAuth from '../useFetchWithAuth';
import type { ChannelPermission } from '../../types';

export function useChannelPermissionsQuery(communityIds: number[]) {
  const fetchWithAuth = useFetchWithAuth();

  return useQuery<ChannelPermission[]>({
    queryKey: queryKeysV2.channelPermissions.all(communityIds),
    queryFn: () => getChannelPermissions(fetchWithAuth, communityIds),
    enabled: communityIds.length > 0,
  });
}

async function getChannelPermissions(
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
  communityIds: number[],
) {
  const params = new URLSearchParams();
  communityIds.forEach(id => params.append('communityIds', id.toString()));

  const response = await fetchWithAuth(
    `${API_CHANNEL_PERMISSIONS}?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch channel permissions (V2): ${response.status}`,
    );
  }

  return response.json();
}
