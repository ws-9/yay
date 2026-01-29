import { Outlet } from 'react-router';
import { useBootstrapQuery } from '../../hooks/useBootstrapQuery';

export default function AppDataProvider() {
  const { isLoading, error } = useBootstrapQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading application data</div>;
  }

  return <Outlet />;
}
