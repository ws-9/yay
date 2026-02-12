import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { API_CHANNELS } from '../../constants';
import { queryKeys } from '../queryKeys';
import useFetchWithAuth from '../useFetchWithAuth';

export type ChannelPermission = {
  channelId: number;
  roleId: number;
  canRead: boolean;
  canWrite: boolean;
};

export default function useChannelPermissionsQuery<
  T = Array<ChannelPermission>,
>(
  channelId: number | null,
  options?: Omit<
    UseQueryOptions<Array<ChannelPermission>, Error, T>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetchWithAuth = useFetchWithAuth();

  return useQuery<Array<ChannelPermission>, Error, T>({
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
    ...options,
  });
}
