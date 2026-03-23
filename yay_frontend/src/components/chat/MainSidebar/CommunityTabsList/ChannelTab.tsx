import { useChannelV2Query } from '../../../../hooks/queries/useChannelV2Query';
import {
  getActivePaneId,
  useWorkspaceActions,
} from '../../../../store/workspaceStore';
import ChannelMenu from '../ChannelMenu';

export default function ChannelTab({ channelId }: { channelId: number }) {
  const { setChannel } = useWorkspaceActions();
  const { data: channelData } = useChannelV2Query(channelId);

  if (!channelData) {
    return null;
  }

  function handleClick() {
    const activePaneId = getActivePaneId();

    if (activePaneId) {
      setChannel(activePaneId, channelId);
    }
  }

  return (
    <div
      className="flex cursor-pointer justify-between"
      onClick={handleClick}
      draggable
      onDragStart={event => {
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('channelId', channelId.toString());
      }}
    >
      - {channelData.name}
      <ChannelMenu channelId={channelId} />
    </div>
  );
}
