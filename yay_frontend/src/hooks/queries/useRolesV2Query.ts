import { useQuery } from '@tanstack/react-query';
import { API_ROLES } from '../../constants';
import { queryKeysV2 } from '../queryKeys';
import useFetchWithAuth from '../useFetchWithAuth';
import type { RoleV2 } from '../../types';

export function useRolesV2Query() {
  const fetchWithAuth = useFetchWithAuth();

  return useQuery<RoleV2[]>({
    queryKey: queryKeysV2.roles.all,
    queryFn: () => getRoles(fetchWithAuth),
    staleTime: Infinity, // Roles are static templates, fetch once per session
    gcTime: Infinity,
  });
}

async function getRoles(
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
) {
  const response = await fetchWithAuth(API_ROLES);

  if (!response.ok) {
    throw new Error(`Failed to fetch roles (V2): ${response.status}`);
  }

  return response.json();
}
