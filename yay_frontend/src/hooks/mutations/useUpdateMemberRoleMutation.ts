import { useMutation, useQueryClient } from '@tanstack/react-query';
import useFetchWithAuth from '../useFetchWithAuth';
import type { Member } from '../../types/Member';
import { API_MEMBERS } from '../../constants';
import { queryKeys } from '../queryKeys';

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
      const response = await fetchWithAuth(API_MEMBERS, {
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
        queryKeys.communities.members.role(data.communityId, data.userId),
        data.role,
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.communities.members.detail(data.communityId),
      });
    },
  });
}
