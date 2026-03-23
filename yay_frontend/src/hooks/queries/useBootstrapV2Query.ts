import { useQuery } from '@tanstack/react-query';
import { API_COMMUNITIES, API_ROLES, API_ME } from '../../constants';
import useFetchWithAuth from '../useFetchWithAuth';
import { queryKeysV2 } from '../queryKeys';
import type { CommunityV2, RoleV2, UserV2 } from '../../types';

export type BootstrapV2Response = {
  communities: CommunityV2[];
  roles: RoleV2[];
  user: UserV2;
};

/**
 * Fetches the core global data required to boot the V2 application.
 * Component-specific data (Channels, Memberships) is fetched by the components themselves.
 */
export function useBootstrapV2Query() {
  const fetchWithAuth = useFetchWithAuth();

  return useQuery<BootstrapV2Response>({
    queryKey: queryKeysV2.bootstrap,
    queryFn: async () => {
      const [userRes, rolesRes, communitiesRes] = await Promise.all([
        fetchWithAuth(API_ME),
        fetchWithAuth(API_ROLES),
        fetchWithAuth(`${API_COMMUNITIES}?joined=true`),
      ]);

      if (!userRes.ok) throw new Error('Failed to fetch user identity');
      if (!rolesRes.ok) throw new Error('Failed to fetch roles');
      if (!communitiesRes.ok) throw new Error('Failed to fetch communities');

      const [user, roles, communities] = await Promise.all([
        userRes.json(),
        rolesRes.json(),
        communitiesRes.json(),
      ]);

      return {
        user,
        roles,
        communities,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}
