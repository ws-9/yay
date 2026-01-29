import { useBootstrapQuery } from './useBootstrapQuery';

export default function useMyCommunitiesQuery() {
  return useBootstrapQuery({
    select: data => data.communities,
  });
}
