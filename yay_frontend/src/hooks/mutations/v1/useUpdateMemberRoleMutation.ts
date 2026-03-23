import { useMutation, useQueryClient } from '@tanstack/react-query';
import useFetchWithAuth from '../../useFetchWithAuth';
import type { Member } from '../../../types/v1/Member';
import { API_MEMBERS_V1 } from '../../../constants';
import { queryKeysV1 } from '../../queryKeys';

type UpdateMemberRoleRequest = {
  communityId: number;
  userId: number;
  role: string;
};

export function useUpdateMemberRoleMutation() {
  const fetchWithAuth = useFetchWithAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: UpdateMemberRoleRequest): Promise<Member> => {
      const response = await fetchWithAuth(API_MEMBERS_V1, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          communityId: request.communityId,
          userId: request.userId,
          role: request.role,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update member role: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: async (data: Member) => {
      queryClient.setQueryData(
        queryKeysV1.communities.members.role(data.communityId, data.userId),
        data.role,
      );
      queryClient.invalidateQueries({
        queryKey: queryKeysV1.communities.members.detail(data.communityId),
      });
    },
  });
}
