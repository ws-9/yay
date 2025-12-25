import { useEffect, useState } from 'react';
import {
  useWebSocketActions,
  useWebSocketConnectedStatus,
} from '../../store/webSocketStore';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { ChannelMessagePageParam } from '../../types/ChannelMessagePageParam';
import type { CursorPaginatedChannelMessages } from '../../types/CursorPaginatedChannelMessages';
import type { ChannelMessage } from '../../types/ChannelMessage';
import { API_CHANNELS } from '../../constants';
import { useTokenState } from '../../store/authStore';

const PAGE_SIZE = 10;

export default function Inbox({
  selectedChannel,
}: {
  selectedChannel: number;
}) {
  const { subscribe } = useWebSocketActions();
  const webSocketConnected = useWebSocketConnectedStatus();
  const [messageEvents, setMessagesEvents] = useState<Array<ChannelMessage>>(
    [],
  );
  const { data, error, status } = useInfiniteQuery({
    queryKey: ['channels', selectedChannel, 'messages'],
    queryFn: fetchMessages,
    initialPageParam: {
      id: selectedChannel,
      size: PAGE_SIZE,
      cursor: null as string | null,
      cursorId: null as number | null,
    },
    getNextPageParam: lastPage => {
      if (!lastPage.hasNext) {
        return undefined;
      }

      return {
        id: selectedChannel,
        size: PAGE_SIZE,
        cursor: lastPage.nextCursor,
        cursorId: lastPage.nextCursorId,
      };
    },
  });

  if (data) {
    console.log(data);
  }

  async function fetchMessages({
    pageParam,
  }: {
    pageParam: ChannelMessagePageParam;
  }): Promise<CursorPaginatedChannelMessages> {
    const { token } = useTokenState();
    const params = new URLSearchParams({
      size: PAGE_SIZE.toString(),
    });

    if (pageParam.cursor) {
      params.append('cursor', pageParam.cursor);
    }
    if (pageParam.cursorId) {
      params.append('cursorId', pageParam.cursorId.toString());
    }

    const response = await fetch(
      `${API_CHANNELS}/${selectedChannel}/messages?${params}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.json();
  }

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
  }, [selectedChannel, webSocketConnected, subscribe]);

  const renderedMessages = messageEvents.map(message => (
    <MessageRender
      key={message.id}
      username={message.username}
      message={message.message}
      createdAt={message.createdAt}
    />
  ));
  return <div className="overflow-y-auto">{renderedMessages}</div>;
}

function MessageRender({
  username,
  message,
  createdAt,
}: {
  username: string;
  message: string;
  createdAt: string;
}) {
  return <div>{`[${createdAt}] ${username}: ${message}`}</div>;
}
