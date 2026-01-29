import { useQueryClient } from '@tanstack/react-query';
import type { Community } from '../types/Community';
import type { BootstrapResponse } from './useBootstrapQuery';
import type { Channel } from '../types/Channel';
import { queryKeys } from './queryKeys';

export function useCreateCommunityOptimistically() {
  const queryClient = useQueryClient();
  return function createCommunityOptimistically(newCommunity: Community) {
    // Update bootstrap cache
    queryClient.setQueryData(
      queryKeys.bootstrap,
      (old: BootstrapResponse | undefined) => {
        if (!old) {
          return {
            communities: [newCommunity],
            user: {
              id: newCommunity.ownerId,
              username: newCommunity.ownerUsername,
            },
          };
        }
        return {
          ...old,
          communities: [...old.communities, newCommunity],
        };
      },
    );
    // Set individual community cache
    queryClient.setQueryData(
      queryKeys.communities.detail(newCommunity.id),
      newCommunity,
    );
    // Set community role cache
    queryClient.setQueryData(
      queryKeys.communities.members.role(newCommunity.id, newCommunity.ownerId),
      newCommunity.role,
    );
  };
}

export function useCreateChannelOptimistically() {
  const queryClient = useQueryClient();
  return function createChannelOptimistically(newChannel: Channel) {
    // Update bootstrap cache
    queryClient.setQueryData(
      queryKeys.bootstrap,
      (old: BootstrapResponse | undefined) => {
        if (!old) {
          return old;
        }
        return {
          ...old,
          communities: old.communities.map(community => {
            if (community.id === newChannel.communityId) {
              return {
                ...community,
                channels: [...(community.channels || []), newChannel],
              };
            }
            return community;
          }),
        };
      },
    );
    // Update individual community cache
    queryClient.setQueryData(
      queryKeys.communities.detail(newChannel.communityId),
      (old: Community | undefined) => {
        if (!old) {
          return old;
        }
        return {
          ...old,
          channels: [...(old.channels || []), newChannel],
        };
      },
    );
    // Set individual channel cache
    queryClient.setQueryData(
      queryKeys.channels.detail(newChannel.id),
      newChannel,
    );
  };
}

export function useRemoveCommunityOptimistically() {
  const queryClient = useQueryClient();
  return function removeCommunityOptimistically(communityId: number) {
    queryClient.setQueryData(
      queryKeys.bootstrap,
      (old: BootstrapResponse | undefined) => {
        if (!old) {
          return old;
        }
        return {
          ...old,
          communities: old.communities.filter(c => c.id !== communityId),
        };
      },
    );
  };
}
