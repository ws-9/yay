import React, { useRef } from 'react';
import MessageField from './MessageField';
import Inbox, { type InboxHandle } from './Inbox';
import { useChannelQuery } from '../../hooks/useChannelQuery';
import {
  useIsActivePane,
  useWorkspaceActions,
} from '../../store/workspaceStore';
import type { SplitDirection } from '../../types/BSPChatNode';
import DropZones from './DropZones';

export default function ChatPane({
  channelId,
  nodeId,
  mode = 'multi',
}: {
  channelId: number | null;
  nodeId: string;
  mode?: 'single' | 'multi';
}) {
  const inboxRef = useRef<InboxHandle>(null);
  const { setChannel, splitNodeWithChannel } = useWorkspaceActions();

  function handleDrop(
    event: React.DragEvent,
    action: 'replace' | SplitDirection,
  ) {
    // drop is not enabled by default.
    event.preventDefault();
    const channelId = parseInt(event.dataTransfer.getData('channelId'));

    if (action === 'replace') {
      setChannel(nodeId, channelId);
    } else {
      splitNodeWithChannel(nodeId, action, channelId);
    }
  }

  return (
    <PaneSelector nodeId={nodeId}>
      <PaneHeader nodeId={nodeId} channelId={channelId} />

      {mode === 'multi' && <DropZones onDrop={handleDrop} />}

      {channelId === null ? (
        <div className="m-auto content-center text-gray-500">
          Select a channel from the sidebar
        </div>
      ) : (
        <>
          {/* inboxRef refers to scrollToBottom defined within inbox */}
          <Inbox ref={inboxRef} channelId={channelId} />
          <MessageField
            channelId={channelId}
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

  // relative pos so absolute pos in dropzones works
  return (
    <div
      className={`relative grid h-full min-h-0 grid-rows-[auto_1fr_auto] ${
        isActive && 'ring-blue-500 ring-inset sm:ring-2'
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
  const showCloseButton = nodeId !== 'root' || channelId !== null;
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
        className="hidden rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600 sm:block"
        title="Split up"
      >
        ↑
      </button>
      <button
        onClick={e => {
          e.stopPropagation();
          splitNode(nodeId, 'south');
        }}
        className="hidden rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600 sm:block"
        title="Split down"
      >
        ↓
      </button>
      <button
        onClick={e => {
          e.stopPropagation();
          splitNode(nodeId, 'west');
        }}
        className="hidden rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600 sm:block"
        title="Split left"
      >
        ←
      </button>
      <button
        onClick={e => {
          e.stopPropagation();
          splitNode(nodeId, 'east');
        }}
        className="hidden rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600 sm:block"
        title="Split right"
      >
        →
      </button>
      {showCloseButton && (
        <button
          onClick={e => {
            e.stopPropagation();
            removeNode(nodeId);
          }}
          className="ml-auto hidden rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600 sm:block"
          title="Close Pane"
        >
          ✕
        </button>
      )}
    </div>
  );
}
