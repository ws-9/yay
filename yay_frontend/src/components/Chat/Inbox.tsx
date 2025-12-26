import { useEffect, useState } from 'react';
import {
  useWebSocketActions,
  useWebSocketConnectedStatus,
} from '../../store/webSocketStore';
import type { ChannelMessage } from '../../types/ChannelMessage';
import { format } from 'date-fns';
import { useInfChannelMessagesQuery } from '../../hooks/useInfChannelMessagesQuery';

export default function Inbox({
  selectedChannel,
}: {
  selectedChannel: number;
}) {
  const { data, error, status, hasNextPage, fetchNextPage } =
    useInfChannelMessagesQuery({ selectedChannel });
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

  const oldMessages = data?.pages.flatMap(page => page.data) ?? [];
  const allMessages = [...oldMessages, ...messageEvents].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const renderedMessages = allMessages.map(message => (
    <MessageRender
      key={message.id}
      username={message.username}
      message={message.message}
      createdAt={message.createdAt}
    />
  ));

  return (
    <div className="overflow-y-auto">
      {renderedMessages}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>Load more</button>
      )}
    </div>
  );
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
  const formattedDate = format(new Date(createdAt), 'MM/dd/yyyy HH:mm:ss');
  return <div>{`${formattedDate} ${username}: ${message}`}</div>;
}
