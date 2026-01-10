import type { BSPChatNode } from '../../types/BSPChatNode';
import type { SplitDirection } from '../../types/BSPChatNode';
import ChatPane from './Pane/ChatPane';

export default function BSPChatNodeRender({ node }: { node: BSPChatNode }) {
  if (node.type === 'pane') {
    return <ChatPane channelId={node.channelId} nodeId={node.id} />;
  }

  return (
    <ChatSplit direction={node.direction} left={node.left} right={node.right} />
  );
}

function ChatSplit({
  direction,
  left,
  right,
}: {
  direction: SplitDirection;
  left: BSPChatNode;
  right: BSPChatNode;
}) {
  const isHorizontal = direction === 'east' || direction === 'west';

  return (
    <div
      className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'} h-full w-full`}
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
