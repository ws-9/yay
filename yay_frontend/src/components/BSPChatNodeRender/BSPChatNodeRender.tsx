import type { BSPChatNode } from '../../types/BSPChatNode';
import ChatPane from '../Chat/ChatPane';
import {
  useWorkspaceActions,
  useActivePaneId,
} from '../../store/workspaceStore';

export default function BSPChatNodeRender({ node }: { node: BSPChatNode }) {
  const { splitNode, removeNode, setActivePane } = useWorkspaceActions();
  const activePaneId = useActivePaneId();
  const isActive = node.type === 'pane' && node.id === activePaneId;

  if (node.type === 'pane') {
    return (
      <div
        className={`relative flex h-full w-full flex-col ${
          isActive ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => setActivePane(node.id)}
      >
        {/* Pane controls */}
        <div className="flex gap-2 border-b bg-gray-100 p-1">
          <button
            onClick={() => splitNode(node.id, 'horizontal')}
            className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
            title="Split Side by Side"
          >
            ↔
          </button>
          <button
            onClick={() => splitNode(node.id, 'vertical')}
            className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
            title="Split Top and Bottom"
          >
            ↕
          </button>
          {node.id !== 'root' && (
            <button
              onClick={() => removeNode(node.id)}
              className="ml-auto rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
              title="Close Pane"
            >
              ✕
            </button>
          )}
        </div>

        {/* Pane content */}
        <div className="flex-1 overflow-hidden">
          {node.channelId !== null ? (
            <ChatPane selectedChannel={node.channelId} />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              Select a channel from the sidebar
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${node.direction === 'horizontal' ? 'flex-row' : 'flex-col'} h-full w-full`}
    >
      <div className="flex-1 overflow-hidden border-r border-b">
        <BSPChatNodeRender node={node.left} />
      </div>
      <div className="flex-1 overflow-hidden">
        <BSPChatNodeRender node={node.right} />
      </div>
    </div>
  );
}
