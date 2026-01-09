import { useQuery } from '@tanstack/react-query';
import { API_MY_COMMUNITIES } from '../constants';
import { getTokenState } from '../store/authStore';
import type { Community } from '../types/Community';

export default function useMyCommunitiesQuery() {
  const { token } = getTokenState();

  const query = useQuery<Array<Community>>({
    queryKey: ['communities', 'my-communities'],
    queryFn: () => getMyCommunities(token),
  });

  return query;
}

async function getMyCommunities(token: string | null) {
  const response = await fetch(API_MY_COMMUNITIES, {
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
