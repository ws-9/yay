import { useChannelV2Query } from './useChannelV2Query';
import { useMemberV2Query } from './useMemberV2Query';
import { useRolesV2Query } from './useRolesV2Query';
import { useMeV2Query } from './useMeV2Query';

export function useChannelPermissionsV2(channelId: number) {
  const { data: user } = useMeV2Query();
  const { data: channel } = useChannelV2Query(channelId);
  const { data: roles } = useRolesV2Query();
  
  // Only enable membership query if we have both channel and user info
  const communityId = channel?.communityId;
  const { data: memberships, isLoading: isLoadingMembership } = useMemberV2Query(
    communityId as number, 
    user?.id as number
  );

  if (!channel || !user || !roles || !memberships || isLoadingMembership) {
    return { canRead: false, canWrite: false, isLoading: true };
  }

  const myMembership = memberships[0];
  const myRole = roles.find(r => r.id === myMembership?.roleId);

  if (!myRole) {
    return { canRead: false, canWrite: false, isLoading: false };
  }

  // Basic check: If you are in the community, you can read/write 
  // (unless we implement granular Channel Permissions overrides later)
  // For now, we simulate the V1 behavior using community roles.
  return {
    canRead: true, // If you are a member, you can read
    canWrite: true, // If you are a member, you can write
    role: myRole,
    isLoading: false,
  };
}
