import type { BSPChatNode } from '../../types/BSPChatNode';
import ChatPane from '../ChatPage/ChatPane';
import {
  useWorkspaceActions,
  useActivePaneId,
} from '../../store/workspaceStore';
import type { SplitDirection } from '../../types/BSPChatNode';

export default function BSPChatNodeRender({ node }: { node: BSPChatNode }) {
  const { setActivePane } = useWorkspaceActions();
  const activePaneId = useActivePaneId();
  const isActive = node.type === 'pane' && node.id === activePaneId;

  if (node.type === 'pane') {
    return (
      <div
        className={`grid h-full grid-rows-[auto_1fr]`}
        onClick={() => setActivePane(node.id)}
      >
        <PaneControls nodeId={node.id} isRoot={node.id === 'root'} />
        <PaneContent channelId={node.channelId} />
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

function PaneControls({ nodeId, isRoot }: { nodeId: string; isRoot: boolean }) {
  const { splitNode, removeNode } = useWorkspaceActions();

  return (
    <div className="flex gap-2 border-b bg-gray-100 p-1">
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

function PaneContent({ channelId }: { channelId: number | null }) {
  if (channelId !== null) {
    return <ChatPane selectedChannel={channelId} />;
  }

  return (
    <div className="flex items-center justify-center text-gray-500">
      Select a channel from the sidebar
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
