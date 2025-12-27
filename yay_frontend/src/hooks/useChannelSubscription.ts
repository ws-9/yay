import { useEffect, useEffectEvent, useState } from 'react';
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

  const doSubscribe = useEffectEvent((channelId: number) => {
    return subscribe(`/topic/channel/${channelId}`, payload => {
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
    });
  });

  useEffect(() => {
    if (!webSocketConnected || !selectedChannel) {
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessagesEvents([]);

    const unsubscribe = doSubscribe(selectedChannel);

    return unsubscribe;
  }, [selectedChannel, webSocketConnected]);

  return messageEvents;
}
