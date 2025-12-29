import { useRef } from 'react';
import MessageField from './MessageField';
import Inbox, { type InboxHandle } from './Inbox';
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
  const inboxRef = useRef<InboxHandle>(null);

  return (
    <PaneSelector nodeId={nodeId}>
      <PaneHeader nodeId={nodeId} channelId={selectedChannel} />
      {selectedChannel === null ? (
        <div className="m-auto content-center text-gray-500">
          Select a channel from the sidebar
        </div>
      ) : (
        <>
          {/* inboxRef refers to scrollToBottom defined within inbox */}
          <Inbox ref={inboxRef} selectedChannel={selectedChannel} />
          <MessageField
            selectedChannel={selectedChannel}
            onMessageSent={() => inboxRef.current?.scrollToBottom()}
          />
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
      className={`grid h-full min-h-0 grid-rows-[auto_1fr_auto] ${
        isActive && 'ring-2 ring-blue-500 ring-inset'
      }`}
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
        onClick={e => {
          e.stopPropagation();
          splitNode(nodeId, 'north');
        }}
        className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
        title="Split up"
      >
        ↑
      </button>
      <button
        onClick={e => {
          e.stopPropagation();
          splitNode(nodeId, 'south');
        }}
        className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
        title="Split down"
      >
        ↓
      </button>
      <button
        onClick={e => {
          e.stopPropagation();
          splitNode(nodeId, 'west');
        }}
        className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
        title="Split left"
      >
        ←
      </button>
      <button
        onClick={e => {
          e.stopPropagation();
          splitNode(nodeId, 'east');
        }}
        className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
        title="Split right"
      >
        →
      </button>
      {!isRoot && (
        <button
          onClick={e => {
            e.stopPropagation();
            removeNode(nodeId);
          }}
          className="ml-auto rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
          title="Close Pane"
        >
          ✕
        </button>
      )}
    </div>
  );
}
