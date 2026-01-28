import { Outlet } from 'react-router';
import useMyCommunitiesQuery from '../../hooks/useMyCommunitiesQuery';

export default function AppDataProvider() {
  // TODO: persist cache so browser refresh doesn't trigger the load
  const { isLoading, error } = useMyCommunitiesQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading application data</div>;
  }

  return <Outlet />;
}
