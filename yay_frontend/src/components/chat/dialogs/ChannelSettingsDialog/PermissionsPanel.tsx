import { Tabs } from '@base-ui/react/tabs';
import { useRolesV2Query } from '../../../../hooks/queries/useRolesV2Query';
import { useChannelV2Query } from '../../../../hooks/queries/useChannelV2Query';
import { useChannelPermissionsV2Query } from '../../../../hooks/queries/useChannelPermissionsV2Query';
import { useMemberV2Query } from '../../../../hooks/queries/useMemberV2Query';
import { Select } from '@base-ui/react/select';
import useChannelPermissionMutation from '../../../../hooks/mutations/useChannelPermissionMutation';
import { useState } from 'react';
import { useMeV2Query } from '../../../../hooks/queries/useMeV2Query';
import type { RoleV2 } from '../../../../types';

const accessOptions = [
  { label: 'Can read', value: 'read' },
  { label: 'Can read and write', value: 'readWrite' },
  { label: 'No access', value: 'none' },
];

export default function PermissionsPanel({ channelId }: { channelId: number }) {
  const userInfoQuery = useMeV2Query();
  const channelQuery = useChannelV2Query(channelId);
  const rolesQuery = useRolesV2Query();

  const communityId = channelQuery.data?.communityId;
  const permissionsQuery = useChannelPermissionsV2Query(
    communityId ? [communityId] : [],
  );

  const myMemberQuery = useMemberV2Query(
    communityId ?? null,
    userInfoQuery.data?.id ?? null,
  );

  const isLoadingData =
    userInfoQuery.isLoading ||
    channelQuery.isLoading ||
    rolesQuery.isLoading ||
    permissionsQuery.isLoading ||
    myMemberQuery.isLoading;

  if (isLoadingData) {
    return <div>Loading...</div>;
  }

  const allRoles = rolesQuery.data!;
  const allPermissions = permissionsQuery.data!;
  const myMembership = myMemberQuery.data?.[0];
  const userRole = allRoles.find(r => r.id === myMembership?.roleId);

  if (!userRole) {
    return <div>Access denied</div>;
  }

  // Map each role to its permission for THIS channel, or default to read/write
  const permissionsList = allRoles.map(role => {
    const override = allPermissions.find(
      p => p.channelId === channelId && p.roleId === role.id,
    );

    return (
      <PermissionRow
        key={role.id}
        channelId={channelId}
        role={role}
        canRead={override ? override.canRead : true}
        canWrite={override ? override.canWrite : true}
        userRole={userRole}
      />
    );
  });

  return (
    <Tabs.Panel className="flex-1 space-y-4 p-6" value="members">
      {permissionsList}
    </Tabs.Panel>
  );
}

function PermissionRow({
  channelId,
  role,
  canRead,
  canWrite,
  userRole,
}: {
  channelId: number;
  role: RoleV2;
  canRead: boolean;
  canWrite: boolean;
  userRole: RoleV2;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{role.name}</span>
      <AccessSelector
        channelId={channelId}
        canRead={canRead}
        canWrite={canWrite}
        role={role}
        userRole={userRole}
      />
    </div>
  );
}

function AccessSelector({
  channelId,
  canRead,
  canWrite,
  role,
  userRole,
}: {
  channelId: number;
  canRead: boolean;
  canWrite: boolean;
  role: RoleV2;
  userRole: RoleV2;
}) {
  const { mutate } = useChannelPermissionMutation(channelId);
  const [value, setValue] = useState(toAccessOption(canRead, canWrite));

  const isDisabled = userRole.hierarchyLevel >= role.hierarchyLevel;

  function handleAccessChange(newAccessValue: string | null) {
    if (newAccessValue === null) {
      return;
    }

    setValue(newAccessValue);

    if (newAccessValue === 'read') {
      mutate({
        roleId: role.id,
        canRead: true,
        canWrite: false,
      });
    } else if (newAccessValue === 'readWrite') {
      mutate({
        roleId: role.id,
        canRead: true,
        canWrite: true,
      });
    } else if (newAccessValue === 'none') {
      mutate({
        roleId: role.id,
        canRead: false,
        canWrite: false,
      });
    }
  }

  return (
    <Select.Root
      items={accessOptions}
      value={value}
      onValueChange={handleAccessChange}
    >
      <Select.Trigger
        disabled={isDisabled}
        className="flex h-10 min-w-40 items-center justify-between gap-3 rounded-md border border-gray-200 bg-[canvas] pr-3 pl-3.5 text-base text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 disabled:cursor-not-allowed disabled:opacity-50 data-[popup-open]:bg-gray-100"
      >
        <Select.Value className="data-placeholder:opacity-60" />
        <Select.Icon className="flex">
          <ChevronUpDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner
          className="z-10 outline-none select-none"
          sideOffset={8}
        >
          <Select.Popup className="group min-w-[var(--anchor-width)] origin-[var(--transform-origin)] rounded-md bg-[canvas] bg-clip-padding text-gray-900 shadow-lg shadow-gray-200 outline outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] data-[side=none]:data-[ending-style]:transition-none data-[starting-style]:scale-90 data-[starting-style]:opacity-0 data-[side=none]:data-[starting-style]:scale-100 data-[side=none]:data-[starting-style]:opacity-100 data-[side=none]:data-[starting-style]:transition-none dark:shadow-none dark:outline-gray-300">
            <Select.ScrollUpArrow className="top-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md bg-[canvas] text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:top-[-100%]" />
            <Select.List className="relative max-h-[var(--available-height)] scroll-py-6 overflow-y-auto py-1">
              {accessOptions.map(({ label, value }) => (
                <Select.Item
                  key={label}
                  value={value}
                  className="grid cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-none select-none group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4 data-disabled:cursor-not-allowed data-disabled:bg-gray-100 data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900 pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]"
                >
                  <Select.ItemIndicator className="col-start-1">
                    <CheckIcon className="size-3" />
                  </Select.ItemIndicator>
                  <Select.ItemText className="col-start-2">
                    {label}
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
            <Select.ScrollDownArrow className="bottom-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md bg-[canvas] text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:bottom-[-100%]" />
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

function ChevronUpDownIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
      stroke="currentcolor"
      strokeWidth="1.5"
      {...props}
    >
      <path d="M0.5 4.5L4 1.5L7.5 4.5" />
      <path d="M0.5 7.5L4 10.5L7.5 7.5" />
    </svg>
  );
}

function CheckIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      fill="currentcolor"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      {...props}
    >
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  );
}

function toAccessOption(canRead: boolean, canWrite: boolean): string {
  if (!canRead && !canWrite) {
    return 'none';
  } else if (canRead && !canWrite) {
    return 'read';
  } else {
    return 'readWrite';
  }
}
