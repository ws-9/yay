import {
  getActivePaneId,
  useWorkspaceActions,
} from '../../../../store/workspaceStore';
import ChannelMenu from '../ChannelMenu';

export default function ChannelTab({ name, id }: { name: string; id: number }) {
  const { setChannel } = useWorkspaceActions();

  function handleClick() {
    const activePaneId = getActivePaneId();

    if (activePaneId) {
      setChannel(activePaneId, id);
    }
  }

  return (
    <div
      className="flex cursor-pointer justify-between"
      onClick={handleClick}
      draggable
      onDragStart={event => {
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('channelId', id.toString());
      }}
    >
      - {name}
      <ChannelMenu channelId={id} />
    </div>
  );
}
