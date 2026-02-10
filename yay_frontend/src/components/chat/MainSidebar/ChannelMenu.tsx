import { useUiStoreActions } from '../../../store/uiStore';
import { Button } from '@base-ui/react/button';

export default function ChannelMenu({ channelId }: { channelId: number }) {
  const { openChannelSettingsDialog } = useUiStoreActions();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    openChannelSettingsDialog(channelId);
  }

  return (
    <Button
      onClick={handleClick}
      className="flex h-10 items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base font-medium text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 data-[popup-open]:bg-gray-100"
    >
      ⋮
    </Button>
  );
}
