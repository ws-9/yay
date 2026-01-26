import { useQuery } from '@tanstack/react-query';
import { getMemberRole } from './userBatchFetcher';
import type { CommunityRole } from '../types/CommunityRole';

// Uses batching so that each query within a timeframe gets combined into a single one
export function useMemberRole(
  communityId: number | null,
  userId: number | null,
) {
  return useQuery<CommunityRole>({
    queryKey: ['communities', communityId, 'members', userId, 'role'],
    queryFn: async () => {
      return getMemberRole(communityId!, userId!);
    },
    enabled: communityId !== null && userId !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
