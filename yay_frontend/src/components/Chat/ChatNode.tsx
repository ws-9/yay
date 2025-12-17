import { useState, useEffect, type KeyboardEvent } from 'react';
import { useSelectedChannel } from '../../store/selectionStore';
import {
  useWebSocketActions,
  useWebSocketConnectedStatus,
} from '../../store/webSocketStore';
import { useChannelQuery } from '../../hooks/useChannelQuery';

type ChannelMessageBroadcast = {
  id: number;
  message: string;
  userId: number;
  username: string;
  channelId: number;
};

type ChannelMessageEvent = {
  message: string;
};

export default function ChatNode() {
  const selectedChannel = useSelectedChannel();
  const [message, setMessage] = useState('');
  const { subscribe, publish } = useWebSocketActions();
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

  function handleEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      if (!message.trim()) {
        return;
      }
      event.preventDefault();
      const messageBroadcast: ChannelMessageEvent = { message };
      publish(`/app/chat/${selectedChannel}`, messageBroadcast);
      console.log('yeah');
      setMessage('');
    }
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto]">
      <div className="border-b-2">Top Bar</div>
      <div className="overflow-y-auto">
        <p>Selected Channel = {selectedChannel || 'None'}</p>
        {isLoading ? <div>Loading</div> : <div>{JSON.stringify(data)}</div>}
        {renderedMessages}
      </div>
      <textarea
        className="field-sizing-content max-h-[9lh] w-full resize-none border-2"
        placeholder="Type away..."
        value={message}
        onChange={event => setMessage(event.target.value)}
        onKeyDown={handleEnter}
      />
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
