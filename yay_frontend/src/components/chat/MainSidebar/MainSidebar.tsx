import { useNavigate } from 'react-router';
import { useAuthActions } from '../../../store/authStore';
import CommunityTabsList from './CommunityTabsList';
import CommunityDialog from './CommunityDialog';

export default function MainSidebar() {
  const { logout } = useAuthActions();
  const navigate = useNavigate();

  return (
    <div className="hidden max-h-full grid-rows-[1fr_auto] border-r-2 sm:grid">
      <div className="overflow-y-auto">
        <CommunityTabsList />
        <CommunityDialog />
      </div>
      <button
        className="cursor-pointer"
        onClick={() => {
          logout();
          navigate('/login');
        }}
      >
        Logout
      </button>
    </div>
  );
}
