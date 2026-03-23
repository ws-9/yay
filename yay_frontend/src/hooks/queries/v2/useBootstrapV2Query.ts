import { useQuery } from '@tanstack/react-query';
import {
  API_COMMUNITIES_V2,
  API_ROLES_V2,
  API_ME_V2,
} from '../../../constants';
import useFetchWithAuth from '../../useFetchWithAuth';
import type {
  CommunityV2,
  RoleV2,
  UserV2,
} from '../../../types/v2';

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
    queryKey: ['v2', 'bootstrap'],
    queryFn: async () => {
      const [userRes, rolesRes, communitiesRes] = await Promise.all([
        fetchWithAuth(API_ME_V2),
        fetchWithAuth(API_ROLES_V2),
        fetchWithAuth(`${API_COMMUNITIES_V2}?joined=true`),
      ]);

      if (!userRes.ok) throw new Error('Failed to fetch user identity');
      if (!rolesRes.ok) throw new Error('Failed to fetch roles');
      if (!communitiesRes.ok) throw new Error('Failed to fetch communities');

      return {
        user: await userRes.json(),
        roles: await rolesRes.json(),
        communities: await communitiesRes.json(),
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}
