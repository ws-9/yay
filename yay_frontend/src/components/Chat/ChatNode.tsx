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

export default function ChatNode() {
  const selectedChannel = useSelectedChannel();
  const { subscribe } = useWebSocketActions();
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
      <p>Selected Channel = {selectedChannel || 'None'}</p>
      {isLoading ? <div>Loading</div> : <div>{JSON.stringify(data)}</div>}
    </div>
  );
}
