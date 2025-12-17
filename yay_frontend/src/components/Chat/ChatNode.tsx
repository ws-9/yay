import { useState, useEffect, type KeyboardEvent } from 'react';
import { useSelectedChannel } from '../../store/selectionStore';
import {
  useWebSocketActions,
  useWebSocketConnectedStatus,
} from '../../store/webSocketStore';
import { useChannelQuery } from '../../hooks/useChannelQuery';
import MessageField from './MessageField';
import type { ChannelMessageBroadcast } from '../../types/ChannelMessageBroadcast';

export default function ChatNode() {
  const selectedChannel = useSelectedChannel();
  const { subscribe } = useWebSocketActions();
  const webSocketConnected = useWebSocketConnectedStatus();
  const [messageEvents, setMessagesEvents] = useState<
    Array<ChannelMessageBroadcast>
  >([]);
  const { data, isLoading, error } = useChannelQuery(selectedChannel);

  useEffect(() => {
    if (!webSocketConnected || !selectedChannel) {
      return;
    }
    setMessagesEvents([]);

    const unsubscribe = subscribe(
      `/topic/channel/${selectedChannel}`,
      payload => {
        setMessagesEvents(prev => [
          ...prev,
          {
            id: payload.id,
            message: payload.message,
            userId: payload.userId,
            username: payload.username,
            channelId: payload.channelId,
          },
        ]);
      },
    );

    return unsubscribe;
  }, [selectedChannel, webSocketConnected, subscribe]);

  const renderedMessages = messageEvents.map(message => (
    <MessageRender
      key={message.id}
      username={message.username}
      message={message.message}
    />
  ));

  return (
    <div className="grid grid-rows-[auto_1fr_auto]">
      <div className="border-b-2">
        {isLoading ? 'Loading' : `${data?.name} @ ${data?.communityName}`}
      </div>
      <div className="overflow-y-auto">{renderedMessages}</div>
      <MessageField selectedChannel={selectedChannel} />
    </div>
  );
}

function MessageRender({
  username,
  message,
}: {
  username: string;
  message: string;
}) {
  return <div>{`${username}: ${message}`}</div>;
}
