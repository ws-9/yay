import { useEffect, useEffectEvent, useState } from 'react';
import {
  useWebSocketActions,
  useWebSocketConnectedStatus,
} from '../store/webSocketStore';
import type { ChannelMessage } from '../types/ChannelMessage';

export function useChannelSubscription(channelId: number) {
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
    if (!webSocketConnected || !channelId) {
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessagesEvents([]);

    const unsubscribe = doSubscribe(channelId);

    return unsubscribe;
  }, [channelId, webSocketConnected]);

  return messageEvents;
}
