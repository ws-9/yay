import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_CHANNEL_PERMISSIONS } from '../../constants';
import useFetchWithAuth from '../useFetchWithAuth';
import { queryKeysV2 } from '../queryKeys';
import type { ChannelPermission } from '../../types/ChannelPermission';

type ChannelPermissionInput = {
  roleId: number;
  canRead: boolean;
  canWrite: boolean;
};

export default function useChannelPermissionMutation(channelId: number) {
  const fetchWithAuth = useFetchWithAuth();
  const queryClient = useQueryClient();

  return useMutation<ChannelPermission, Error, ChannelPermissionInput>({
    mutationFn: async function (request) {
      const response = await fetchWithAuth(API_CHANNEL_PERMISSIONS, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelId,
          roleId: request.roleId,
          canRead: request.canRead,
          canWrite: request.canWrite,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(json));
      }

      return json;
    },
    onSuccess: async data => {
      // Update individual permission cache
      queryClient.setQueryData(
        queryKeysV2.channelPermissions.detail(data.channelId, data.roleId),
        data,
      );
      // Invalidate all channel permissions list since we don't have communityId here
      queryClient.invalidateQueries({
        queryKey: ['v2', 'channel-permissions'],
      });
    },
  });
}
