import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_CHANNELS } from '../../constants';
import useFetchWithAuth from '../useFetchWithAuth';
import { queryKeys } from '../queryKeys';

type ChannelPermissionInput = {
  roleId: number;
  canRead: boolean;
  canWrite: boolean;
};

export type ChannelPermission = {
  channelId: number;
  roleId: number;
  canRead: boolean;
  canWrite: boolean;
};

export default function useChannelPermissionMutation(channelId: number) {
  const fetchWithAuth = useFetchWithAuth();
  const queryClient = useQueryClient();

  return useMutation<ChannelPermission, Error, ChannelPermissionInput>({
    mutationFn: async function (request) {
      const response = await fetchWithAuth(
        `${API_CHANNELS}/${channelId}/permissions`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roleId: request.roleId,
            canRead: request.canRead,
            canWrite: request.canWrite,
          }),
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(json));
      }

      return json;
    },
    onSuccess: async data => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.channels.permissions(data.channelId),
      });
    },
  });
}
