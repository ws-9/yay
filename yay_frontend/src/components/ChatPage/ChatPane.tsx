import MessageField from './MessageField';
import Inbox from './Inbox';
import { useChannelQuery } from '../../hooks/useChannelQuery';
import {
  useIsActivePane,
  useWorkspaceActions,
} from '../../store/workspaceStore';

export default function ChatPane({
  selectedChannel,
  nodeId,
}: {
  selectedChannel: number | null;
  nodeId: string;
}) {
  return (
    <PaneSelector nodeId={nodeId}>
      <PaneHeader nodeId={nodeId} channelId={selectedChannel} />
      {selectedChannel === null ? (
        <div className="flex items-center justify-center text-gray-500">
          Select a channel from the sidebar
        </div>
      ) : (
        <>
          <Inbox selectedChannel={selectedChannel} />
          <MessageField selectedChannel={selectedChannel} />
        </>
      )}
    </PaneSelector>
  );
}

function PaneSelector({
  nodeId,
  children,
}: {
  nodeId: string;
  children: React.ReactNode;
}) {
  const { setActivePane } = useWorkspaceActions();
  const isActive = useIsActivePane(nodeId);
  return (
    <div
      className="grid h-full min-h-0 grid-rows-[auto_1fr_auto]"
      onClick={() => setActivePane(nodeId)}
    >
      {children}
    </div>
  );
}

function PaneHeader({
  nodeId,
  channelId,
}: {
  nodeId: string;
  channelId: number | null;
}) {
  const { splitNode, removeNode } = useWorkspaceActions();
  const isRoot = nodeId === 'root';
  const { data, isLoading, error } = useChannelQuery(channelId);

  return (
    <div className="flex gap-2 border-b bg-gray-100 p-1">
      {channelId !== null && (
        <div className="border-b-2">
          {isLoading ? 'Loading' : `${data?.name} @ ${data?.communityName}`}
        </div>
      )}
      <button
        onClick={() => splitNode(nodeId, 'horizontal')}
        className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
        title="Split Side by Side"
      >
        ↔
      </button>
      <button
        onClick={() => splitNode(nodeId, 'vertical')}
        className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
        title="Split Top and Bottom"
      >
        ↕
      </button>
      {!isRoot && (
        <button
          onClick={() => removeNode(nodeId)}
          className="ml-auto rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
          title="Close Pane"
        >
          ✕
        </button>
      )}
    </div>
  );
}
