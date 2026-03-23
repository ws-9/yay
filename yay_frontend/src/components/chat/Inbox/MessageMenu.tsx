import { Menu } from '@base-ui/react/menu';
import useDeleteChannelMessage from '../../../hooks/mutations/v1/useDeleteChannelMessageMutation';
import { useChannelV2Query } from '../../../hooks/queries/v2/useChannelV2Query';
import { useCommunityV2Query } from '../../../hooks/queries/v2/useCommunityV2Query';
import { useMemberV2Query } from '../../../hooks/queries/v2/useMemberV2Query';
import { useRolesV2Query } from '../../../hooks/queries/v2/useRolesV2Query';
import useRemoveMemberMutation from '../../../hooks/mutations/v1/useRemoveMemberMutation';
import useBanMember from '../../../hooks/mutations/v1/useBanMemberMutation';
import type { MessageV2, RoleV2 } from '../../../types/v2';
import { useMeV2Query } from '../../../hooks/queries/v2/useMeV2Query';

type MessageMenuProps = {
  message: MessageV2;
  channelId: number;
  onEdit?: () => void;
};

export default function MessageMenu({
  message,
  channelId,
  onEdit,
}: MessageMenuProps) {
  const { data: userInfo } = useMeV2Query();
  const { data: channel } = useChannelV2Query(channelId);
  const { data: community } = useCommunityV2Query(channel?.communityId ?? null);
  const { data: roles } = useRolesV2Query();

  const deleteMutation = useDeleteChannelMessage();
  const kickMutation = useRemoveMemberMutation();
  const banMutation = useBanMember();

  const communityId = channel?.communityId;
  const isCurrentUserOwner = community?.ownerId === userInfo?.id;
  const isTargetOwner = message.userId === community?.ownerId;

  // Get current user's membership and role
  const { data: currentUserMemberships } = useMemberV2Query(
    communityId ?? 0,
    userInfo?.id ?? 0,
  );
  const currentUserRole = roles?.find(
    r => r.id === currentUserMemberships?.[0]?.roleId,
  );

  // Get message author's membership and role
  const { data: authorMemberships } = useMemberV2Query(
    communityId ?? 0,
    message.userId,
  );
  const authorRole = roles?.find(r => r.id === authorMemberships?.[0]?.roleId);

  const canDelete = canUserDeleteMessage(
    userInfo?.id,
    currentUserRole,
    message.userId,
    authorRole,
    isCurrentUserOwner,
    !!message.deletedAt,
  );

  const canEdit =
    userInfo?.id === message.userId && !message.deletedAt && !!currentUserRole;

  const canBan = canUserBanMember(
    userInfo?.id,
    currentUserRole,
    message.userId,
    authorRole,
    isCurrentUserOwner,
    isTargetOwner,
  );

  function handleEdit() {
    onEdit?.();
  }

  function handleDelete() {
    deleteMutation.mutate({ id: message.id });
  }

  function handleKick() {
    if (communityId) {
      kickMutation.mutate({ communityId, userId: message.userId });
    }
  }

  function handleBan() {
    if (communityId) {
      banMutation.mutate({ communityId, userId: message.userId });
    }
  }

  if (!canDelete && !canEdit && !canBan) {
    return null;
  }

  return (
    <Menu.Root>
      <Menu.Trigger
        onClick={event => event.stopPropagation()}
        className="absolute top-0 right-0 mr-1 h-max rounded-md border border-gray-200 bg-gray-50 px-2 text-base font-medium text-gray-900 opacity-0 select-none group-hover:opacity-100 hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 data-popup-open:bg-gray-100"
      >
        ⋮
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner className="outline-none" sideOffset={3}>
          <Menu.Popup
            onClick={event => event.stopPropagation()}
            className="origin-(--transform-origin) rounded-md bg-[canvas] py-1 text-gray-900 shadow-lg shadow-gray-200 outline outline-gray-200 transition-[transform,scale,opacity] data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300"
          >
            {canEdit && (
              <Menu.Item
                onClick={handleEdit}
                className="flex cursor-default items-center gap-2 py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-highlighted:relative data-highlighted:z-0 data-highlighted:text-gray-50 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-gray-900"
              >
                Edit Message
              </Menu.Item>
            )}
            {canDelete && (
              <Menu.Item
                onClick={handleDelete}
                className="flex cursor-default items-center gap-2 py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-highlighted:relative data-highlighted:z-0 data-highlighted:text-gray-50 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-gray-900"
              >
                Delete Message
              </Menu.Item>
            )}
            {canBan && (
              <Menu.Item
                onClick={handleKick}
                className="flex cursor-default items-center gap-2 py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-highlighted:relative data-highlighted:z-0 data-highlighted:text-gray-50 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-gray-900"
              >
                Kick User
              </Menu.Item>
            )}
            {canBan && (
              <Menu.Item
                onClick={handleBan}
                className="flex cursor-default items-center gap-2 py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-highlighted:relative data-highlighted:z-0 data-highlighted:text-gray-50 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-gray-900"
              >
                Ban User
              </Menu.Item>
            )}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

function canUserDeleteMessage(
  currentUserId: number | undefined,
  currentUserRole: RoleV2 | null | undefined,
  messageUserId: number,
  authorRole: RoleV2 | null | undefined,
  isCurrentUserOwner: boolean,
  isDeleted: boolean,
): boolean {
  // Can't delete already deleted messages
  if (isDeleted) {
    return false;
  }

  // Owner can delete any message
  if (isCurrentUserOwner) {
    return true;
  }

  // Author can always delete their own messages
  if (currentUserId === messageUserId) {
    return true;
  }

  // If current user has no role, can't delete
  if (!currentUserRole) {
    return false;
  }

  // If author has no role (left the server), treat as any other message
  // Check if current user has delete permission
  if (!authorRole) {
    return currentUserRole.canDeleteMessages;
  }

  // Check if current user has delete permission and higher hierarchy (lower number = stronger)
  return (
    currentUserRole.canDeleteMessages &&
    currentUserRole.hierarchyLevel < authorRole.hierarchyLevel
  );
}

function canUserBanMember(
  currentUserId: number | undefined,
  currentUserRole: RoleV2 | null | undefined,
  targetUserId: number,
  targetRole: RoleV2 | null | undefined,
  isCurrentUserOwner: boolean,
  isTargetOwner: boolean,
): boolean {
  // Can't ban yourself
  if (currentUserId === targetUserId) {
    return false;
  }

  // Can't ban the owner
  if (isTargetOwner) {
    return false;
  }

  // Can't ban someone who's not in the server
  if (!targetRole) {
    return false;
  }

  // Owner can ban anyone else
  if (isCurrentUserOwner) {
    return true;
  }

  // If current user has no role, can't ban
  if (!currentUserRole) {
    return false;
  }

  // Check if current user has ban permission and strictly higher hierarchy (lower number = stronger)
  return (
    currentUserRole.canBanUsers &&
    currentUserRole.hierarchyLevel < targetRole.hierarchyLevel
  );
}
