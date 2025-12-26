import type { BSPChatNode } from '../../types/BSPChatNode';
import ChatPane from '../ChatPage/ChatPane';
import {
  useWorkspaceActions,
  useActivePaneId,
} from '../../store/workspaceStore';
import type { SplitDirection } from '../../types/BSPChatNode';
import { useChannelQuery } from '../../hooks/useChannelQuery';

export default function BSPChatNodeRender({ node }: { node: BSPChatNode }) {
  const { setActivePane } = useWorkspaceActions();
  const activePaneId = useActivePaneId();
  const isActive = node.type === 'pane' && node.id === activePaneId;

  if (node.type === 'pane') {
    return (
      <div
        className="grid h-full min-h-0 grid-rows-[auto_1fr_auto]"
        onClick={() => setActivePane(node.id)}
      >
        <PaneHeader nodeId={node.id} channelId={node.channelId} />
        <ChatPane selectedChannel={node.channelId} />
      </div>
    );
  }

  return (
    <SplitContainer
      direction={node.direction}
      left={node.left}
      right={node.right}
    />
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

function SplitContainer({
  direction,
  left,
  right,
}: {
  direction: SplitDirection;
  left: BSPChatNode;
  right: BSPChatNode;
}) {
  return (
    <div
      className={`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} h-full w-full`}
    >
      <div className="flex-1 overflow-hidden border-r border-b">
        <BSPChatNodeRender node={left} />
      </div>
      <div className="flex-1 overflow-hidden">
        <BSPChatNodeRender node={right} />
      </div>
    </div>
  );
}
