import { useChannelQuery } from '../../hooks/useChannelQuery';
import MessageField from './MessageField';
import Inbox from './Inbox';

export default function ChatNode({
  selectedChannel,
}: {
  selectedChannel: number | null;
}) {
  const { data, isLoading, error } = useChannelQuery(selectedChannel);

  return (
    <div className="grid grid-rows-[auto_1fr_auto]">
      <div className="border-b-2">
        {isLoading ? 'Loading' : `${data?.name} @ ${data?.communityName}`}
      </div>
      {selectedChannel ? (
        <Inbox selectedChannel={selectedChannel} />
      ) : (
        <div>Loading</div>
      )}
      <MessageField selectedChannel={selectedChannel} />
    </div>
  );
}
