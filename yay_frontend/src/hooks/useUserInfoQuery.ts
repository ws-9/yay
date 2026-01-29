import { useQuery } from '@tanstack/react-query';
import { API_ME } from '../constants';
import { getTokenState } from '../store/authStore';
import { queryKeys } from './queryKeys';

export type UserInfoResponse = {
  username: string;
  id: number;
};

export function useUserInfoQuery() {
  const { token } = getTokenState();

  const query = useQuery<UserInfoResponse>({
    queryKey: queryKeys.me,
    queryFn: () => getMe(token!),
    staleTime: Infinity, // Always use cache, never auto-refetch
    gcTime: Infinity, // Keep cache permanently
  });

  return query;
}

async function getMe(token: string) {
  const response = await fetch(API_ME, {
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
