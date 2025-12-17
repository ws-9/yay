import { useState, type KeyboardEvent } from 'react';
import { useWebSocketActions } from '../../store/webSocketStore';
import type { ChannelMessageEvent } from '../../types/ChannelMessageEvent';

export default function MessageField({
  selectedChannel,
}: {
  selectedChannel: number | null;
}) {
  const [message, setMessage] = useState('');
  const { publish } = useWebSocketActions();

  function handleEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      if (!message.trim()) {
        return;
      }
      event.preventDefault();
      const messageBroadcast: ChannelMessageEvent = { message };
      publish(`/app/chat/${selectedChannel}`, messageBroadcast);
      console.log('yeah');
      setMessage('');
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
