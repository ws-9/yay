import { useUserInfoQuery } from './useUserInfoQuery';
import { useMemberRole } from './useMemberRoleQuery';
import useChannelPermissionsQuery from './useChannelPermissionsQuery';
import { useChannelQuery } from './useChannelQuery';
import type { ChannelPermission } from './useChannelPermissionsQuery';

export default function useUserChannelPermissionQuery(
  channelId: number | null,
) {
  const { data: userInfo } = useUserInfoQuery();
  const { data: channel } = useChannelQuery(channelId);
  const { data: userRole } = useMemberRole(
    channel?.communityId ?? null,
    userInfo?.id ?? null,
  );

  return useChannelPermissionsQuery<ChannelPermission | null>(channelId, {
    select: (permissions: ChannelPermission[]) => {
      if (!userRole) {
        return null;
      }
      return permissions.find(perm => perm.roleId === userRole.id) ?? null;
    },
    enabled: userRole !== null && userRole !== undefined,
  });
}
