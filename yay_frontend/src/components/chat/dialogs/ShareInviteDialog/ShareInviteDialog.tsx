import { Dialog } from '@base-ui/react/dialog';
import {
  useShareInviteDialog,
  useUiStoreActions,
} from '../../../../store/uiStore';
import { useCommunityInviteQuery } from '../../../../hooks/useCommunityInviteQuery';

export default function ShareInviteDialog() {
  const { communityId, isOpen } = useShareInviteDialog();
  const { closeShareInviteDialog } = useUiStoreActions();
  const { data } = useCommunityInviteQuery(communityId);

  return (
    <Dialog.Root
      open={isOpen && communityId !== null}
      onOpenChange={closeShareInviteDialog}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute dark:opacity-70" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -mt-8 w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-50 p-6 text-gray-900 outline outline-1 outline-gray-200 transition-all duration-150 data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:outline-gray-300">
          <Dialog.Title className="-mt-1.5 mb-1 text-lg font-medium">
            Share Invite
          </Dialog.Title>
          <Dialog.Description className="mb-6 text-base text-gray-600">
            Share this link so others can join
          </Dialog.Description>
          {data && <p>{data.inviteSlug}</p>}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
