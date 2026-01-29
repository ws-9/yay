import { useQuery } from '@tanstack/react-query';
import { create, windowScheduler } from '@yornaath/batshit';
import { API_COMMUNITIES } from '../constants';
import { getTokenState } from '../store/authStore';
import { useUserInfoQuery } from './useUserInfoQuery';
import type { CommunityRole } from '../types/CommunityRole';
import { queryKeys } from './queryKeys';

export type MemberRoleQuery = {
  communityId: number;
  userId: number;
};

function isValidMemberRolesResponse(
  data: unknown,
): data is { roles: Record<string, CommunityRole | null> } {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  if (typeof obj.roles !== 'object' || obj.roles === null) return false;
  return true;
}

const memberRolesBatcher = create({
  fetcher: async (
    queries: MemberRoleQuery[],
    signal: AbortSignal,
  ): Promise<(CommunityRole | null)[]> => {
    const { token } = getTokenState();

    // Group queries by community ID, mapping to user IDs
    const communityIdToUserIds = new Map<number, number[]>();
    queries.forEach(query => {
      if (!communityIdToUserIds.has(query.communityId)) {
        communityIdToUserIds.set(query.communityId, []);
      }
      communityIdToUserIds.get(query.communityId)!.push(query.userId);
    });

    // Fetch all communities' member roles
    const fetchedCommunityRoles: (CommunityRole | null)[] = [];

    for (const [communityId, userIds] of communityIdToUserIds) {
      const response = await fetch(
        `${API_COMMUNITIES}/${communityId}/members/roles`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userIds }),
          signal,
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch member roles for community ${communityId}`,
        );
      }

      const data = await response.json();

      if (!isValidMemberRolesResponse(data)) {
        throw new Error(`Invalid response format for community ${communityId}`);
      }

      // Add user IDs back to the role responses so the resolver can match them
      const rolesWithIds = Object.entries(data.roles).map(([userId, role]) =>
        role === null ? null : { ...role, id: Number(userId) },
      );

      fetchedCommunityRoles.push(...rolesWithIds);
    }

    return fetchedCommunityRoles;
  },
  resolver: (results, query) =>
    results.find(r => (r === null ? false : r.id === query.userId)) || null,
  scheduler: windowScheduler(50),
});

/**
 * Fetch member roles. Intelligently handles two cases:
 * - If userId is the current user: reads from cache only (seeded by initial load)
 * - If userId is another user: batches requests with reasonable cache times (5m staleTime, 10m gcTime)
 */
function useMemberRoleQuery(communityId: number | null, userId: number | null) {
  const { data: userInfo } = useUserInfoQuery();
  const isCurrentUser = userInfo?.id === userId;

  return useQuery<CommunityRole | null>({
    queryKey: queryKeys.communities.members.role(communityId!, userId!),
    queryFn: async () => {
      return memberRolesBatcher.fetch({
        communityId: communityId!,
        userId: userId!,
      });
    },
    enabled: !isCurrentUser && communityId !== null && userId !== null,
    staleTime: isCurrentUser ? Infinity : 5 * 60 * 1000,
    gcTime: isCurrentUser ? Infinity : 10 * 60 * 1000,
  });
}

export function useMemberRole(
  communityId: number | null,
  userId: number | null,
) {
  return useMemberRoleQuery(communityId, userId);
}
