import React, { useEffect, useRef, useState } from 'react';
import MessageField from './MessageField';
import Inbox, { type InboxHandle } from './Inbox';
import { useChannelQuery } from '../../hooks/useChannelQuery';
import {
  useIsActivePane,
  useWorkspaceActions,
} from '../../store/workspaceStore';
import type { SplitDirection } from '../../types/BSPChatNode';

export default function ChatPane({
  selectedChannel,
  nodeId,
}: {
  selectedChannel: number | null;
  nodeId: string;
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
      <PaneHeader nodeId={nodeId} channelId={selectedChannel} />

      <DropZones onDrop={handleDrop} />

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

function DropZones({
  onDrop,
}: {
  onDrop: (event: React.DragEvent, action: 'replace' | SplitDirection) => void;
}) {
  // is there a drag event occuring?
  const [isDragging, setIsDragging] = useState(false);
  // on which zone?
  const [activeZone, setActiveZone] = useState<
    'replace' | SplitDirection | null
  >(null);

  useEffect(() => {
    // on drag entering drop zone
    const handleDragEnter = () => setIsDragging(true);
    // on user stops dragging
    const handleDragEnd = () => setIsDragging(false);
    // on user stops dragging while on drop zone
    const handleDrop = () => setIsDragging(false);

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragend', handleDragEnd);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragend', handleDragEnd);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  if (!isDragging) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-50 grid grid-cols-[1fr_2fr_1fr] grid-rows-[1fr_2fr_1fr]">
      {/* North */}
      <div
        className={`pointer-events-auto col-start-2 row-start-1 ${activeZone === 'north' ? 'bg-blue-500/50' : 'bg-blue-300/20'}`}
        /* Consider on drag enter */
        // Right now this kinda fires constantly
        onDragOver={e => {
          e.preventDefault();
          setActiveZone('north');
        }}
        onDragLeave={() => setActiveZone(null)}
        onDrop={e => onDrop(e, 'north')}
      />

      {/* West */}
      <div
        className={`pointer-events-auto col-start-1 row-start-2 ${activeZone === 'west' ? 'bg-blue-500/50' : 'bg-blue-300/20'}`}
        onDragOver={e => {
          e.preventDefault();
          setActiveZone('west');
        }}
        onDragLeave={() => setActiveZone(null)}
        onDrop={e => onDrop(e, 'west')}
      />

      {/* Center (replace) */}
      <div
        className={`pointer-events-auto col-start-2 row-start-2 ${activeZone === 'replace' ? 'bg-green-500/50' : 'bg-green-300/20'}`}
        onDragOver={e => {
          e.preventDefault();
          setActiveZone('replace');
        }}
        onDragLeave={() => setActiveZone(null)}
        onDrop={e => onDrop(e, 'replace')}
      />

      {/* East */}
      <div
        className={`pointer-events-auto col-start-3 row-start-2 ${activeZone === 'east' ? 'bg-blue-500/50' : 'bg-blue-300/20'}`}
        onDragOver={e => {
          e.preventDefault();
          setActiveZone('east');
        }}
        onDragLeave={() => setActiveZone(null)}
        onDrop={e => onDrop(e, 'east')}
      />

      {/* South */}
      <div
        className={`pointer-events-auto col-start-2 row-start-3 ${activeZone === 'south' ? 'bg-blue-500/50' : 'bg-blue-300/20'}`}
        onDragOver={e => {
          e.preventDefault();
          setActiveZone('south');
        }}
        onDragLeave={() => setActiveZone(null)}
        onDrop={e => onDrop(e, 'south')}
      />
    </div>
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
      {showCloseButton && (
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
