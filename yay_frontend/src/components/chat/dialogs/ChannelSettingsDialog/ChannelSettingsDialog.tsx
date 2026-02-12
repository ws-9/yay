import { Dialog } from '@base-ui/react/dialog';
import {
  useChannelSettingsDialog,
  useUiStoreActions,
} from '../../../../store/uiStore';
import ChannelSettingsTabs from './ChannelSettingsTabs';

export default function ChannelSettingsDialog() {
  const { isOpen, channelId } = useChannelSettingsDialog();
  const { closeChannelSettingsDialog } = useUiStoreActions();

  return (
    <Dialog.Root
      open={isOpen && channelId !== null}
      onOpenChange={closeChannelSettingsDialog}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute dark:opacity-70" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -mt-8 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-50 p-6 text-gray-900 outline outline-1 outline-gray-200 transition-all duration-150 data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:outline-gray-300">
          <ChannelSettingsTabs channelId={channelId} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
