import { useQuery, useQueryClient } from '@tanstack/react-query';
import { API_MY_COMMUNITIES } from '../constants';
import { getTokenState } from '../store/authStore';
import type { Community } from '../types/Community';
import { useEffect } from 'react';
import { useUserInfoQuery } from './useUserInfoQuery';

export default function useMyCommunitiesQuery() {
  const { token } = getTokenState();
  const queryClient = useQueryClient();
  const { data: userInfo } = useUserInfoQuery();

  const query = useQuery<Array<Community>>({
    queryKey: ['communities', 'my-communities'],
    queryFn: () => getMyCommunities(token),
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });

  // Seed caches for channels and member roles
  useEffect(() => {
    if (query.data && userInfo) {
      query.data.forEach(community => {
        // Seed individual community cache
        queryClient.setQueryData(['communities', community.id], community);

        // Seed channel cache for each channel in the community
        community.channels?.forEach(channel => {
          queryClient.setQueryData(['channels', channel.id], channel);
        });

        // Seed member role cache for current user in each community
        if (community.role) {
          queryClient.setQueryData(
            ['communities', community.id, 'members', userInfo.id, 'role'],
            community.role,
          );
        }
      });
    }
  }, [query.data, userInfo, queryClient]);

  return query;
}

type UseCommunityByIdReturn = Omit<
  ReturnType<typeof useMyCommunitiesQuery>,
  'data'
> & {
  data: Community | null;
};

export function useCommunityById(communityId: number): UseCommunityByIdReturn {
  const query = useMyCommunitiesQuery();
  const community =
    query.data?.find(c => String(c.id) === String(communityId)) ?? null;

  return {
    ...query,
    data: community,
  };
}

async function getMyCommunities(token: string | null) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const response = await fetch(API_MY_COMMUNITIES, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
