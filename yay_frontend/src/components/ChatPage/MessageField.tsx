import { useState, useEffect, type KeyboardEvent } from 'react';
import { useWebSocketActions } from '../../store/webSocketStore';
import type { ChannelMessageEvent } from '../../types/ChannelMessageEvent';

export default function MessageField({
  channelId,
  onMessageSent,
}: {
  channelId: number;
  onMessageSent?: () => void;
}) {
  const [message, setMessage] = useState('');
  const { publish } = useWebSocketActions();

  // reset message on channel switch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessage('');
  }, [channelId]);

  function handleEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      if (!message.trim()) {
        return;
      }
      event.preventDefault();
      const messageBroadcast: ChannelMessageEvent = { message };
      publish(`/app/chat/${channelId}`, messageBroadcast);
      setMessage('');
      onMessageSent?.();
    }
  }

  return (
    <textarea
      className="field-sizing-content max-h-[9lh] w-full resize-none border-2"
      placeholder="Type away..."
      value={message}
      onChange={event => setMessage(event.target.value)}
      onKeyDown={handleEnter}
    />
  );
}
