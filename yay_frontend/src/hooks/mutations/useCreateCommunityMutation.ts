import { useMutation } from '@tanstack/react-query';
import type { CommunityRole } from '../../types/CommunityRole';
import { API_COMMUNITIES } from '../../constants';
import { useCreateCommunityOptimistically } from '../cacheHelpers';
import useFetchWithAuth from '../useFetchWithAuth';

type CreateCommunityInput = {
  name: string;
};

type CreateCommunityResponse = {
  id: number;
  name: string;
  ownerId: number;
  ownerUsername: string;
  role: CommunityRole;
};

function useCreateCommunityMutation() {
  const fetchWithAuth = useFetchWithAuth();
  const createCommunityOptimistically = useCreateCommunityOptimistically();

  return useMutation<CreateCommunityResponse, Error, CreateCommunityInput>({
    mutationFn: async function (data) {
      const response = await fetchWithAuth(API_COMMUNITIES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(json));
      }

      return json;
    },
    onSuccess: newCommunity => {
      const community = {
        id: newCommunity.id,
        name: newCommunity.name,
        ownerId: newCommunity.ownerId,
        ownerUsername: newCommunity.ownerUsername,
        role: newCommunity.role,
        channels: [],
      };
      createCommunityOptimistically(community);
    },
  });
}

export default function useCreateCommunity() {
  return useCreateCommunityMutation();
}
