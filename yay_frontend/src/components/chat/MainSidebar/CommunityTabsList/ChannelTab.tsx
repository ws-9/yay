import { useChannelQuery } from '../../../../hooks/queries/useChannelQuery';
import useUserChannelPermissionQuery from '../../../../hooks/queries/useUserChannelPermissionQuery';
import {
  getActivePaneId,
  useWorkspaceActions,
} from '../../../../store/workspaceStore';
import ChannelMenu from '../ChannelMenu';

export default function ChannelTab({ channelId }: { channelId: number }) {
  const { setChannel } = useWorkspaceActions();
  const { data: channelData } = useChannelQuery(channelId);
  const { data: permissionData } = useUserChannelPermissionQuery(channelId);

  if (channelData === null || permissionData === null) {
    return null;
  }

  if (!permissionData?.canRead) {
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
      - {channelData?.name}
      <ChannelMenu channelId={channelId} />
    </div>
  );
}
