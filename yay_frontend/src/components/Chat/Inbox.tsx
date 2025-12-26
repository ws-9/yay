import { format } from 'date-fns';
import { useInfChannelMessagesQuery } from '../../hooks/useInfChannelMessagesQuery';
import { useChannelSubscription } from '../../hooks/useChannelSubscription';

export default function Inbox({
  selectedChannel,
}: {
  selectedChannel: number;
}) {
  const { data, error, status, hasNextPage, fetchNextPage } =
    useInfChannelMessagesQuery(selectedChannel);
  const messageEvents = useChannelSubscription(selectedChannel);

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
