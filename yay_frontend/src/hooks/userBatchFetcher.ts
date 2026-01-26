import { create, windowScheduler } from '@yornaath/batshit';
import { getTokenState } from '../store/authStore';
import type { CommunityRole } from '../types/CommunityRole';
import { API_COMMUNITIES } from '../constants';

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

export function getMemberRole(
  communityId: number,
  userId: number,
): Promise<CommunityRole | null> {
  return memberRolesBatcher.fetch({ communityId, userId });
}
