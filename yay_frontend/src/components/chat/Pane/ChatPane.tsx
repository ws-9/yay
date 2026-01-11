import React, { useRef } from 'react';
import { useWorkspaceActions } from '../../../store/workspaceStore';
import type { SplitDirection } from '../../../types/BSPChatNode';
import Inbox, { type InboxHandle } from '../Inbox/Inbox';
import MessageField from '../MessageField/MessageField';
import DropZones, { type DropZonesHandle } from './DropZones';
import PaneHeader from './PaneHeader';

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
  const dropZonesRef = useRef<DropZonesHandle>(null!);
  const { setChannel, splitNodeWithChannel, removeNode } =
    useWorkspaceActions();

  function handleDrop(
    event: React.DragEvent,
    action: 'replace' | SplitDirection,
  ) {
    // drop is not enabled by default.
    event.preventDefault();
    const channelId = parseInt(event.dataTransfer.getData('channelId'));
    const sourceNodeId = event.dataTransfer.getData('nodeId');
    const canReplace = !sourceNodeId || sourceNodeId !== nodeId;

    if (!canReplace) {
      return;
    }

    if (action === 'replace') {
      setChannel(nodeId, channelId);
      if (sourceNodeId) {
        removeNode(sourceNodeId);
      }
    } else {
      splitNodeWithChannel(nodeId, action, channelId);
      if (sourceNodeId) {
        removeNode(sourceNodeId);
      }
    }
  }

  return (
    <PaneSelector nodeId={nodeId}>
      <PaneHeader
        nodeId={nodeId}
        channelId={channelId}
        dropZonesRef={dropZonesRef}
        mode={mode}
      />

      <div className="relative grid h-full min-h-0 grid-rows-[1fr_auto]">
        {mode === 'multi' && (
          <DropZones dropZonesRef={dropZonesRef} onDrop={handleDrop} />
        )}

        {channelId === null ? (
          <div className="m-auto text-gray-500">
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
      </div>
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

  return (
    <div
      className="grid h-full grid-rows-[auto_1fr]"
      onClick={() => setActivePane(nodeId)}
    >
      {children}
    </div>
  );
}
