import { Outlet } from 'react-router';
import { useBootstrapV2Query } from '../../hooks/queries/v2/useBootstrapV2Query';

export default function AppDataProvider() {
  const { isLoading, error } = useBootstrapV2Query();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading application data</div>;
  }

  return <Outlet />;
}

