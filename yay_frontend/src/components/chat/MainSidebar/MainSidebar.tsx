import { useNavigate } from 'react-router';
import { useLogout } from '../../../hooks/mutations/useLogoutMutation';
import CommunityTabsList from './CommunityTabsList/CommunityTabsList';
import CommunityDialog from '../dialogs/CommunityDialog';
import { ScrollArea } from '@base-ui/react/scroll-area';
import { Separator } from '@base-ui/react/separator';

export default function MainSidebar() {
  const { logout } = useLogout();
  const navigate = useNavigate();

  return (
    <div className="hidden max-h-full grid-rows-[1fr_auto_auto] border-r-2 sm:grid">
      <ScrollArea.Root className="h-full min-h-0">
        <ScrollArea.Viewport className="h-full overscroll-contain rounded-md outline outline-1 -outline-offset-1 outline-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800">
          <ScrollArea.Content>
            <CommunityTabsList />
            <CommunityDialog />
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className="pointer-events-none m-2 flex w-1 justify-center rounded bg-gray-200 opacity-0 transition-opacity data-[hovering]:pointer-events-auto data-[hovering]:opacity-100 data-[hovering]:delay-0 data-[scrolling]:pointer-events-auto data-[scrolling]:opacity-100 data-[scrolling]:duration-0">
          <ScrollArea.Thumb className="w-full rounded bg-gray-500" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      <Separator orientation="horizontal" className="h-px bg-gray-500" />
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
