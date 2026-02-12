import { Tabs } from '@base-ui/react/tabs';
import { Select } from '@base-ui/react/select';
import useMembersQuery from '../../../../hooks/queries/useMembersQuery';
import { useCommunityQuery } from '../../../../hooks/queries/useCommunityQuery';
import type { Member } from '../../../../types/Member';
import { useUserInfoQuery } from '../../../../hooks/queries/useUserInfoQuery';
import { useMemberRole } from '../../../../hooks/queries/useMemberRoleQuery';
import { useUpdateMemberRoleMutation } from '../../../../hooks/mutations/useUpdateMemberRoleMutation';
import type { CommunityRole } from '../../../../types/CommunityRole';

const roles = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Moderator', value: 'Moderator' },
  { label: 'Member', value: 'Member' },
];

const roleHierarchies = {
  Admin: 1,
  Moderator: 2,
  Member: 3,
};

export default function MembersPanel({ communityId }: { communityId: number }) {
  const userInfoQuery = useUserInfoQuery();
  const communityQuery = useCommunityQuery(communityId);
  const membersQuery = useMembersQuery(communityId);
  const userRoleQuery = useMemberRole(communityId, userInfoQuery.data?.id ?? 0);

  const isLoading =
    userInfoQuery.isLoading ||
    communityQuery.isLoading ||
    membersQuery.isLoading ||
    userRoleQuery.isLoading;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const community = communityQuery.data!;
  const userRole = userRoleQuery.data!;
  const data = membersQuery.data!;
  const userId = userInfoQuery.data!.id;

  const membersList = data.map(member => (
    <MemberRow
      key={member.userId}
      member={member}
      userRole={userRole}
      ownerId={community.ownerId}
      userId={userId}
      communityId={communityId}
    />
  ));

  return (
    <Tabs.Panel className="flex-1 space-y-4 p-6" value="members">
      {membersList}
    </Tabs.Panel>
  );
}

function MemberRow({
  member,
  userRole,
  ownerId,
  userId,
  communityId,
}: {
  member: Member;
  userRole: CommunityRole;
  ownerId: number;
  userId: number;
  communityId: number;
}) {
  return (
    <div>
      {`${member.username}`}{' '}
      <RoleSelector
        roleName={member.role.name}
        userRole={userRole}
        targetRole={member.role}
        memberId={member.userId}
        ownerId={ownerId}
        userId={userId}
        communityId={communityId}
      />
    </div>
  );
}

function RoleSelector({
  roleName,
  userRole,
  targetRole,
  memberId,
  ownerId,
  userId,
  communityId,
}: {
  roleName: string;
  userRole: CommunityRole;
  targetRole: CommunityRole;
  memberId: number;
  ownerId: number;
  userId: number;
  communityId: number;
}) {
  const updateRoleMutation = useUpdateMemberRoleMutation();

  function handleRoleChange(newRoleValue: string | null) {
    if (newRoleValue) {
      updateRoleMutation.mutate({
        communityId,
        userId: memberId,
        role: newRoleValue,
      });
    }
  }

  return (
    <Select.Root
      items={roles}
      defaultValue={roleName}
      onValueChange={handleRoleChange}
    >
      <Select.Trigger
        disabled={
          !canClickTrigger(
            userRole.hierarchyLevel,
            targetRole.hierarchyLevel,
            memberId,
            ownerId,
            userId,
            userRole.canManageRoles,
          )
        }
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
              {roles.map(({ label, value }) => (
                <Select.Item
                  key={label}
                  value={value}
                  disabled={
                    !canSelectItem(
                      value,
                      userRole.hierarchyLevel,
                      memberId,
                      userId,
                      userRole.canManageRoles,
                      ownerId,
                    )
                  }
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

function canClickTrigger(
  userHierarchy: number,
  targetHierarchy: number,
  targetUserId: number,
  ownerId: number,
  userId: number,
  canManageRoles: boolean,
): boolean {
  if (targetUserId === ownerId) {
    return false;
  }

  if (userId === ownerId) {
    return true;
  }

  // Allow self-changes (self-demotion)
  const isSelf = targetUserId === userId;
  if (isSelf) {
    return true;
  }

  if (!canManageRoles) {
    return false;
  }

  return targetHierarchy > userHierarchy;
}

function canSelectItem(
  itemValue: string,
  userHierarchy: number,
  targetUserId: number,
  userId: number,
  canManageRoles: boolean,
  ownerId: number,
): boolean {
  const itemHierarchy =
    roleHierarchies[itemValue as keyof typeof roleHierarchies];

  const isSelf = targetUserId === userId;

  if (isSelf) {
    return itemHierarchy > userHierarchy;
  }

  if (!canManageRoles) {
    return false;
  }

  if (userId === ownerId) {
    return true;
  }

  return itemHierarchy > userHierarchy;
}
