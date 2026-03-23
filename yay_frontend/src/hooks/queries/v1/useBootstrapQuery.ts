import {
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { API_BOOTSTRAP_V1 } from '../../../constants';
import type { Community } from '../../../types/v1/Community';
import { useEffect } from 'react';
import { queryKeysV1 } from '../../queryKeys';
import useFetchWithAuth from '../../useFetchWithAuth';
import type { UserInfoResponse } from './useUserInfoQuery';

export type BootstrapResponse = {
  communities: Array<Community>;
  user: UserInfoResponse;
};

function isBootstrapResponse(data: unknown): data is BootstrapResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'communities' in data &&
    'user' in data
  );
}

export function useBootstrapQuery<T = BootstrapResponse>(
  options?: Omit<
    UseQueryOptions<BootstrapResponse, Error, T>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryClient = useQueryClient();
  const fetchWithAuth = useFetchWithAuth();

  const query = useQuery<BootstrapResponse, Error, T>({
    queryKey: queryKeysV1.bootstrap,
    queryFn: () => getBootstrap(fetchWithAuth),
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    ...options,
  });

  // Seed all related caches
  useEffect(() => {
    if (isBootstrapResponse(query.data)) {
      const { communities, user } = query.data;

      // Seed the /me cache with user info
      queryClient.setQueryData(queryKeysV1.me, user);

      // Seed individual community, channel, and member role caches
      communities.forEach((community: Community) => {
        // Seed individual community cache
        queryClient.setQueryData(
          queryKeysV1.communities.detail(community.id),
          community,
        );

        // Seed channel cache for each channel in the community
        community.channels?.forEach(channel => {
          queryClient.setQueryData(
            queryKeysV1.channels.detail(channel.id),
            channel,
          );
        });

        // Seed member role cache for current user in each community
        if (community.role) {
          queryClient.setQueryData(
            queryKeysV1.communities.members.role(community.id, user.id),
            community.role,
          );
        }
      });
    }
  }, [query.data, queryClient]);

  return query;
}

async function getBootstrap(
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
) {
  const response = await fetchWithAuth(API_BOOTSTRAP_V1, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
