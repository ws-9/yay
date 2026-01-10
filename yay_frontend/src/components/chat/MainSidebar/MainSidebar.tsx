import { useState, Activity } from 'react';
import { useNavigate } from 'react-router';
import useMyCommunitiesQuery from '../../../hooks/useMyCommunitiesQuery';
import { useAuthActions } from '../../../store/authStore';
import {
  useWorkspaceActions,
  getActivePaneId,
} from '../../../store/workspaceStore';
import type { Channel } from '../../../types/Channel';

export default function MainSidebar() {
  const { logout } = useAuthActions();
  const navigate = useNavigate();
  const { data, isLoading, error } = useMyCommunitiesQuery();

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  const communityTabs = data?.map(community => (
    <CommunityTab
      key={community.id}
      name={community.name}
      channels={community.channels ?? []}
    />
  ));

  return (
    <div className="hidden max-h-full grid-rows-[1fr_auto] border-r-2 sm:grid">
      <div className="overflow-y-auto">{communityTabs}</div>
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

function CommunityTab({
  name,
  channels,
}: {
  name: string;
  channels: Array<Channel>;
}) {
  const channelTabs = channels.map(channel => (
    <ChannelTab key={channel.id} name={channel.name} id={channel.id} />
  ));

  return <Hideable communityName={name}>{channelTabs}</Hideable>;
}

function Hideable({
  communityName,
  children,
}: {
  communityName: string;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full cursor-pointer justify-between"
      >
        <h1>{communityName}</h1>
        <p>{expanded ? 'Less' : 'More'}</p>
      </button>
      <Activity mode={expanded ? 'visible' : 'hidden'}>{children}</Activity>
    </div>
  );
}

function ChannelTab({ name, id }: { name: string; id: number }) {
  const { setChannel } = useWorkspaceActions();

  function handleClick() {
    const activePaneId = getActivePaneId();

    if (activePaneId) {
      setChannel(activePaneId, id);
    }
  }

  return (
    <div
      className="cursor-pointer"
      onClick={handleClick}
      draggable
      onDragStart={event => {
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('channelId', id.toString());
      }}
    >
      - {name}
    </div>
  );
}
