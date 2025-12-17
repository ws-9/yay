import { useState, useEffect } from 'react';
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
  channelId: number;
};

type ChannelMessageEvent = {
  message: string;
};

export default function ChatNode() {
  const selectedChannel = useSelectedChannel();
  const { subscribe, publish } = useWebSocketActions();
  const webSocketConnected = useWebSocketConnectedStatus();
  const [messages, setMessages] = useState<Array<ChannelMessageBroadcast>>([]);
  const { data, isLoading, error } = useChannelQuery(selectedChannel);

  useEffect(() => {
    if (!webSocketConnected || !selectedChannel) {
      return;
    }

    const unsubscribe = subscribe(
      `/topic/channel/${selectedChannel}`,
      payload => {
        setMessages(prev => [
          ...prev,
          {
            id: payload.id,
            message: payload.message,
            userId: payload.userId,
            channelId: payload.channelId,
          },
        ]);
      },
    );

    setMessages([]);

    return unsubscribe;
  }, [selectedChannel, webSocketConnected, subscribe]);

  return (
    <div>
      <p>Chat</p>
      <button className="cursor-pointer" onClick={() => console.log(messages)}>
        Messages
      </button>
      <button
        className="cursor-pointer"
        onClick={() => {
          const message: ChannelMessageEvent = { message: 'hi' };
          publish(`/app/chat/${selectedChannel}`, message);
        }}
      >
        Send message
      </button>
      <p>Selected Channel = {selectedChannel || 'None'}</p>
      {isLoading ? <div>Loading</div> : <div>{JSON.stringify(data)}</div>}
    </div>
  );
}
