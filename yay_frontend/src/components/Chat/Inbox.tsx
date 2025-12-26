import { format } from 'date-fns';
import { useInfChannelMessagesQuery } from '../../hooks/useInfChannelMessagesQuery';
import { useChannelSubscription } from '../../hooks/useChannelSubscription';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export default function Inbox({
  selectedChannel,
}: {
  selectedChannel: number;
}) {
  const { data, error, status, fetchNextPage, isFetchingNextPage } =
    useInfChannelMessagesQuery(selectedChannel);
  const messageEvents = useChannelSubscription(selectedChannel);
  const { ref: endOfInboxRef, inView: endOfInboxInView } = useInView();

  useEffect(() => {
    if (endOfInboxInView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [endOfInboxInView, fetchNextPage, isFetchingNextPage]);

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
      <div ref={endOfInboxRef} className="bg-amber-200">
        End
      </div>
      {renderedMessages}
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
