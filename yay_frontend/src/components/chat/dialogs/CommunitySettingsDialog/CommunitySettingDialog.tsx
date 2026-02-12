import { Dialog } from '@base-ui/react/dialog';
import {
  useCommunitySettingsDialog,
  useUiStoreActions,
} from '../../../../store/uiStore';
import CommunitySettingTabs from './CommunitySettingTabs';

export default function CommunitySettingDialog() {
  const communitySettingsDialog = useCommunitySettingsDialog();
  const { closeCommunitySettingsDialog } = useUiStoreActions();

  return (
    <Dialog.Root
      open={
        communitySettingsDialog.isOpen &&
        communitySettingsDialog.communityId !== null
      }
      onOpenChange={closeCommunitySettingsDialog}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute dark:opacity-70" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -mt-8 w-200 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-50 p-6 text-gray-900 outline outline-1 outline-gray-200 transition-all duration-150 data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:outline-gray-300">
          <CommunitySettingTabs
            communityId={communitySettingsDialog.communityId}
          />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
