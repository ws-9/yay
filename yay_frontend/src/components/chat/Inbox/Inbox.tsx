import { useInfChannelMessagesQuery } from '../../../hooks/useInfChannelMessagesQuery';
import { useChannelSubscription } from '../../../hooks/useChannelSubscription';
import { useInView } from 'react-intersection-observer';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';

import ScrollableContainer, {
  type ScrollableContainerHandle,
} from './ScrollableContainer';
import { MessageRender } from './MessageRender';

export type InboxHandle = {
  scrollToBottom: () => void;
};

export default function Inbox({
  channelId,
  ref,
}: {
  channelId: number;
  ref?: React.Ref<InboxHandle>;
}) {
  const {
    data,
    error,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfChannelMessagesQuery(channelId);
  const messageEvents = useChannelSubscription(channelId);
  const { ref: endOfInboxRef, inView: endOfInboxInView } = useInView();
  const scrollContainerRef = useRef<ScrollableContainerHandle>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // defines what to forward to the parent component
  useImperativeHandle(ref, () => ({
    scrollToBottom: () => {
      scrollContainerRef.current?.scrollToBottom();
    },
  }));

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollToBottom();
    }
  }, []);

  useEffect(() => {
    if (endOfInboxInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [endOfInboxInView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  // cached data if it exists
  const oldMessages = data?.pages.flatMap(page => page.data) ?? [];
  // since we update optimistically, we get duplication if we paginate through old messages.
  const messageMap = new Map(
    [...oldMessages, ...messageEvents].map(msg => [msg.id, msg]),
  );
  const allMessages = [...messageMap.values()].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  useEffect(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    if (isInitialLoad && allMessages.length > 0) {
      scrollContainerRef.current.scrollToBottom();
      setIsInitialLoad(false);
      return;
    }

    if (scrollContainerRef.current.isAtBottom()) {
      scrollContainerRef.current.scrollToBottom();
    }
  }, [allMessages, isInitialLoad]);

  const renderedMessages = allMessages.map(message => (
    <MessageRender
      key={message.id}
      username={message.username}
      message={message.message}
      createdAt={message.createdAt}
      updatedAt={message.updatedAt}
      deletedAt={message.deletedAt}
    />
  ));

  return (
    <ScrollableContainer ref={scrollContainerRef}>
      <div ref={endOfInboxRef} className="bg-amber-200">
        End
      </div>
      {renderedMessages}
    </ScrollableContainer>
  );
}
