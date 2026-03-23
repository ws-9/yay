import { useMutation, useQueryClient } from '@tanstack/react-query';
import useFetchWithAuth from '../useFetchWithAuth';
import type { Member } from '../../types/Member';
import { API_MEMBERS } from '../../constants';
import { queryKeysV2 } from '../queryKeys';

type UpdateMemberRoleInput = {
  communityId: number;
  userId: number;
  roleId: number;
};

export function useUpdateMemberRoleMutation() {
  const fetchWithAuth = useFetchWithAuth();
  const queryClient = useQueryClient();

  return useMutation<Member, Error, UpdateMemberRoleInput>({
    mutationFn: async request => {
      const response = await fetchWithAuth(
        `${API_MEMBERS}/${request.communityId}/${request.userId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roleId: request.roleId,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to update member role: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: data => {
      // Update individual member cache
      queryClient.setQueryData(
        queryKeysV2.members.detail(data.communityId, data.userId),
        data,
      );
      // Invalidate member list for community
      queryClient.invalidateQueries({
        queryKey: queryKeysV2.members.byCommunity(data.communityId),
      });
    },
  });
}
