import { useQuery } from '@tanstack/react-query';
import { API_CHANNELS } from '../../constants';
import { queryKeys } from '../queryKeys';
import useFetchWithAuth from '../useFetchWithAuth';

export default function useUserChannelPermissionQuery(
  channelId: number | null,
) {
  const fetchWithAuth = useFetchWithAuth();

  return useQuery<Array<ChannelPermission>>({
    queryKey: queryKeys.channels.permissions(channelId!),
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${API_CHANNELS}/${channelId}/permissions`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      return response.json();
    },
    enabled: channelId !== null,
  });
}
