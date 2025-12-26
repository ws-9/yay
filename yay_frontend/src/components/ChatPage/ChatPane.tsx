import MessageField from './MessageField';
import Inbox from './Inbox';

export default function ChatPane({
  selectedChannel,
}: {
  selectedChannel: number | null;
}) {
  if (selectedChannel === null) {
    return (
      <div className="flex items-center justify-center text-gray-500">
        Select a channel from the sidebar
      </div>
    );
  }

  return (
    <>
      <Inbox selectedChannel={selectedChannel} />
      <MessageField selectedChannel={selectedChannel} />
    </>
  );
}
