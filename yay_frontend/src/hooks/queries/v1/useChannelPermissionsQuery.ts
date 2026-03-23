import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { API_CHANNELS_V1 } from '../../../constants';
import { queryKeysV1 } from '../../queryKeys';
import useFetchWithAuth from '../../useFetchWithAuth';

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
    queryKey: queryKeysV1.channels.permissions(channelId!),
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${API_CHANNELS_V1}/${channelId}/permissions`,
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
