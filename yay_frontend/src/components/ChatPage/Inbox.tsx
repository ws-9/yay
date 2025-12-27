import { format } from 'date-fns';
import { useInfChannelMessagesQuery } from '../../hooks/useInfChannelMessagesQuery';
import { useChannelSubscription } from '../../hooks/useChannelSubscription';
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef, useState } from 'react';

export default function Inbox({
  selectedChannel,
}: {
  selectedChannel: number;
}) {
  const {
    data,
    error,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfChannelMessagesQuery(selectedChannel);
  const messageEvents = useChannelSubscription(selectedChannel);
  const { ref: endOfInboxRef, inView: endOfInboxInView } = useInView();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (endOfInboxInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [endOfInboxInView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const oldMessages = data?.pages.flatMap(page => page.data) ?? [];
  const allMessages = [...oldMessages, ...messageEvents].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  // Add scroll event listener
  // Updates whether user is at the bottom
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) {
      return;
    }

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setIsScrolledToBottom(atBottom);
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    if (isInitialLoad && allMessages.length > 0) {
      // set the vertical scroll position to the total height of the element
      // this has the equivalent property of scrolling to the very bottom
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setIsInitialLoad(false);
      return;
    }

    if (isScrolledToBottom && allMessages.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [allMessages, isScrolledToBottom, isInitialLoad]);

  const renderedMessages = allMessages.map(message => (
    <MessageRender
      key={message.id}
      username={message.username}
      message={message.message}
      createdAt={message.createdAt}
    />
  ));

  return (
    <div ref={scrollRef} className="overflow-y-auto">
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
