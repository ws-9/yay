import { useQueryClient } from '@tanstack/react-query';
import { queryKeysV2 } from './queryKeys';

export function useInvalidateBootstrap() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeysV2.bootstrap });
}

export function useInvalidateCommunity(communityId: number) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeysV2.communities.detail(communityId) });
    // Also invalidate list of communities
    queryClient.invalidateQueries({ queryKey: queryKeysV2.communities.all });
    queryClient.invalidateQueries({ queryKey: queryKeysV2.communities.joined });
  };
}

export function useInvalidateChannel(channelId: number, communityId?: number) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeysV2.channels.detail(channelId) });
    if (communityId) {
       queryClient.invalidateQueries({ queryKey: queryKeysV2.channels.byCommunity([communityId]) });
    }
  };
}

export function useInvalidateMembers(communityId: number) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeysV2.members.byCommunity(communityId) });
  };
}
