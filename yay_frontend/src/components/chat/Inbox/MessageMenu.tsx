import { Menu } from '@base-ui/react/menu';
import { useUserInfoQuery } from '../../../hooks/useUserInfoQuery';
import useDeleteChannelMessage from '../../../hooks/useDeleteChannelMessageMutation';
import { useMemberRole } from '../../../hooks/useMemberRoleQuery';
import { useChannelQuery } from '../../../hooks/useChannelQuery';
import { useCommunityQuery } from '../../../hooks/useCommunityQuery';
import type { ChannelMessage } from '../../../types/ChannelMessage';
import type { CommunityRole } from '../../../types/CommunityRole';

type MessageMenuProps = {
  message: ChannelMessage;
  channelId: number;
  onEdit?: () => void;
};

export default function MessageMenu({
  message,
  channelId,
  onEdit,
}: MessageMenuProps) {
  const { data: userInfo } = useUserInfoQuery();
  const { data: channel } = useChannelQuery(channelId);
  const { data: community } = useCommunityQuery(channel?.communityId ?? null);
  const deleteMutation = useDeleteChannelMessage();

  const communityId = channel?.communityId;
  const isCurrentUserOwner = community?.ownerId === userInfo?.id;

  // Get current user's role
  const { data: currentUserRole } = useMemberRole(
    communityId ?? null,
    userInfo?.id ?? null,
  );

  // Get message author's role
  const { data: authorRole } = useMemberRole(
    communityId ?? null,
    message.userId,
  );

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

  function handleEdit() {
    onEdit?.();
  }

  function handleDelete() {
    deleteMutation.mutate({ id: message.id });
  }

  if (!canDelete && !canEdit) {
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
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

function canUserDeleteMessage(
  currentUserId: number | undefined,
  currentUserRole: CommunityRole | null | undefined,
  messageUserId: number,
  authorRole: CommunityRole | null | undefined,
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
