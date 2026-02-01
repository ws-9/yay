import { Menu } from '@base-ui/react/menu';
import { useUiStoreActions } from '../../../store/uiStore';
import useRemoveMember from '../../../hooks/useRemoveMemberMutation';
import { Toast } from '@base-ui/react/toast';
import { useEffect, useEffectEvent } from 'react';
import { useUserInfoQuery } from '../../../hooks/useUserInfoQuery';
import type { CommunityRole } from '../../../types/CommunityRole';

export default function CommunityMenu({
  role,
  communityId,
}: {
  role: CommunityRole;
  communityId: number;
}) {
  const { openChannelDialog, openCommunitySettingsDialog } =
    useUiStoreActions();

  return (
    <Menu.Root>
      <Menu.Trigger
        onClick={event => event.stopPropagation()}
        className="flex h-10 items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base font-medium text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 data-[popup-open]:bg-gray-100"
      >
        ⋮
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className="outline-none" sideOffset={8}>
          <Menu.Popup
            onClick={event => event.stopPropagation()}
            className="origin-[var(--transform-origin)] rounded-md bg-[canvas] py-1 text-gray-900 shadow-lg shadow-gray-200 outline outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300"
          >
            {role.canManageChannels && (
              <Menu.Item
                onClick={() => openChannelDialog(communityId)}
                className="flex cursor-default py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900"
              >
                Create Channel
              </Menu.Item>
            )}
            {role.canManageCommunitySettings && (
              <Menu.Item
                onClick={() => openCommunitySettingsDialog(communityId)}
                className="flex cursor-default py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900"
              >
                Community Settings
              </Menu.Item>
            )}
            {(role.canManageChannels || role.canManageCommunitySettings) && (
              <Menu.Separator className="mx-4 my-1.5 h-px bg-gray-200" />
            )}
            <Menu.Item className="flex cursor-default py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900">
              Share Invite
            </Menu.Item>
            <Menu.Item className="flex cursor-default py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900">
              Notification Settings
            </Menu.Item>
            <LeaveCommunityItem communityId={communityId} />
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

function LeaveCommunityItem({ communityId }: { communityId: number }) {
  const { mutate, error } = useRemoveMember();
  const { data, isLoading } = useUserInfoQuery();
  const toastManager = Toast.useToastManager();

  const onError = useEffectEvent(() => {
    toastManager.add({
      title: `Leave Community error`,
      description: 'Something went wrong',
    });
  });

  useEffect(() => {
    if (error) {
      onError();
    }
  }, [error]);

  function handleClick() {
    mutate({ communityId, userId: data!.id });
  }

  return (
    <Menu.Item
      onClick={handleClick}
      className="flex cursor-default py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900"
    >
      Leave Community
    </Menu.Item>
  );
}
