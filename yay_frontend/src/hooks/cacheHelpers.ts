import { useQueryClient } from '@tanstack/react-query';
import type { Community } from '../types/Community';
import type { BootstrapResponse } from './useBootstrapQuery';
import type { Channel } from '../types/Channel';

export function useCreateCommunityOptimistically() {
  const queryClient = useQueryClient();
  return function createCommunityOptimistically(newCommunity: Community) {
    // Update bootstrap cache
    queryClient.setQueryData(
      ['bootstrap'],
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
    queryClient.setQueryData(['communities', newCommunity.id], newCommunity);
    // Set community role cache
    queryClient.setQueryData(
      ['communities', newCommunity.id, 'members', newCommunity.ownerId, 'role'],
      newCommunity.role,
    );
  };
}

export function useCreateChannelOptimistically() {
  const queryClient = useQueryClient();
  return function createChannelOptimistically(newChannel: Channel) {
    // Update bootstrap cache
    queryClient.setQueryData(
      ['bootstrap'],
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
      ['communities', newChannel.communityId],
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
    queryClient.setQueryData(['channels', newChannel.id], newChannel);
  };
}

export function useRemoveCommunityOptimistically() {
  const queryClient = useQueryClient();
  return function removeCommunityOptimistically(communityId: number) {
    queryClient.setQueryData(
      ['bootstrap'],
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
