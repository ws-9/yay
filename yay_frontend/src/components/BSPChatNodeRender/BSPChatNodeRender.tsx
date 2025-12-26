import type { BSPChatNode } from '../../types/BSPChatNode';
import ChatNode from '../Chat/ChatNode';

export default function BSPChatNodeRender({ node }: { node: BSPChatNode }) {
  if (node.type === 'pane') {
    if (node.channelId !== null) {
      return <ChatNode selectedChannel={node.channelId} />;
    } else {
      return <div>Select a channel</div>;
    }
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
