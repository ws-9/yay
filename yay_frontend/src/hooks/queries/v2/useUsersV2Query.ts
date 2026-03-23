import { useQuery } from '@tanstack/react-query';
import { create, windowScheduler } from '@yornaath/batshit';
import { API_USERS_V2 } from '../../../constants';
import { queryKeysV2 } from '../../queryKeys';
import useFetchWithAuth from '../../useFetchWithAuth';
import type { UserV2 } from '../../../types/v2';

function createUsersBatcher(
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
) {
  return create({
    fetcher: async (ids: number[]) => {
      const response = await fetchWithAuth(`${API_USERS_V2}/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) throw new Error('Failed to batch fetch users');
      return response.json();
    },
    resolver: (items: UserV2[], queryId) =>
      items.find(user => user.id === queryId) || null,
    scheduler: windowScheduler(50),
  });
}

/**
 * Hook to fetch a single user's public info via the V2 batch API.
 * Uses 'batshit' to aggregate multiple calls into a single /batch request.
 */
export function useUserV2Query(userId: number) {
  const fetchWithAuth = useFetchWithAuth();
  const batcher = createUsersBatcher(fetchWithAuth);

  return useQuery<UserV2 | null>({
    queryKey: queryKeysV2.users.detail(userId),
    queryFn: () => batcher.fetch(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // Users don't change often
  });
}
