import { useEffect, useState } from 'react';
import {
  useWebSocketActions,
  useWebSocketConnectedStatus,
} from '../store/webSocketStore';
import type { ChannelMessage } from '../types/ChannelMessage';

export function useChannelSubscription(selectedChannel: number) {
  const { subscribe } = useWebSocketActions();
  const webSocketConnected = useWebSocketConnectedStatus();
  const [messageEvents, setMessagesEvents] = useState<Array<ChannelMessage>>(
    [],
  );

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
            createdAt: payload.createdAt,
            updatedAt: payload.updatedAt,
            deletedAt: payload.deletedAt,
          },
        ]);
      },
    );

    return unsubscribe;
  }, [selectedChannel, webSocketConnected]);

  return messageEvents;
}
