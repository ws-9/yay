import { useMutation } from '@tanstack/react-query';
import { API_COMMUNITIES } from '../../constants';
import { useInvalidateBootstrap } from '../cacheHelpers';
import useFetchWithAuth from '../useFetchWithAuth';
import type { CommunityV2 } from '../../types/CommunityV2';

type CreateCommunityInput = {
  name: string;
};

function useCreateCommunityMutation() {
  const fetchWithAuth = useFetchWithAuth();
  const invalidateBootstrap = useInvalidateBootstrap();

  return useMutation<CommunityV2, Error, CreateCommunityInput>({
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
    onSuccess: () => {
      invalidateBootstrap();
    },
  });
}

export default function useCreateCommunity() {
  return useCreateCommunityMutation();
}
