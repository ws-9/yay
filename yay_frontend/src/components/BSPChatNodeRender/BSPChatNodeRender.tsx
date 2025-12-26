import type { BSPChatNode } from '../../types/BSPChatNode';
import ChatPane from '../ChatPage/ChatPane';
import type { SplitDirection } from '../../types/BSPChatNode';

export default function BSPChatNodeRender({ node }: { node: BSPChatNode }) {
  if (node.type === 'pane') {
    return <ChatPane selectedChannel={node.channelId} nodeId={node.id} />;
  }

  return (
    <SplitContainer
      direction={node.direction}
      left={node.left}
      right={node.right}
    />
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
