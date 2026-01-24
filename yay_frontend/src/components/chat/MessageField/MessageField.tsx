import {
  useState,
  useEffect,
  type KeyboardEvent,
  Activity,
  useEffectEvent,
} from 'react';
import { useIsActivePane } from '../../../store/workspaceStore';
import useCreateChannelMessage from '../../../hooks/useCreateChannelMessageMutation';
import { Toast } from '@base-ui/react/toast';

export default function MessageField({
  channelId,
  nodeId,
  onMessageSent,
}: {
  channelId: number;
  nodeId: string;
  onMessageSent?: () => void;
}) {
  const [message, setMessage] = useState('');
  const isActive = useIsActivePane(nodeId);
  const { mutate, isPending, error } = useCreateChannelMessage();
  const toastManager = Toast.useToastManager();

  // reset message on channel switch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessage('');
  }, [channelId]);

  const onError = useEffectEvent(() => {
    toastManager.add({
      title: `Message Error`,
      description: "Something's wrong from our end.",
    });
  });

  useEffect(() => {
    if (error) {
      onError();
    }
  }, [error]);

  function handleEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      if (!message.trim()) {
        return;
      }
      event.preventDefault();

      mutate({ channelId, message });

      setMessage('');
      onMessageSent?.();
    }
  }

  return (
    <Activity mode={isActive ? 'visible' : 'hidden'}>
      <textarea
        className="field-sizing-content max-h-[9lh] w-full resize-none border-2 bg-white transition-all disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:opacity-60"
        placeholder="Type away..."
        value={message}
        disabled={isPending}
        onChange={event => setMessage(event.target.value)}
        onKeyDown={handleEnter}
      />
    </Activity>
  );
}
