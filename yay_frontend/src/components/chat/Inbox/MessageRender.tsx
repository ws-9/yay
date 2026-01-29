import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import MessageMenu from './MessageMenu';
import type { ChannelMessage } from '../../../types/ChannelMessage';

export function MessageRender({
  message,
  channelId,
}: {
  message: ChannelMessage;
  channelId: number;
}) {
  const formattedDate = format(
    new Date(message.createdAt),
    'MM/dd/yyyy HH:mm:ss',
  );

  const markdown = (
    <Markdown
      remarkPlugins={[remarkGfm]}
      allowedElements={['em', 'strong', 'p', 'a']}
      components={{
        p: ({ children }) => <>{children}</>, // keep inline
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
      }}
      unwrapDisallowed={true} // preserve content but remove formatting
    >
      {message.message}
    </Markdown>
  );

  const formattedEditDate = message.updatedAt && (
    <>
      {' '}
      <span>
        (Updated: {format(new Date(message.updatedAt), 'MM/dd/yyyy HH:mm:ss')})
      </span>
    </>
  );

  return (
    <div className="group relative pr-8 hover:bg-gray-100">
      {`${formattedDate} ${message.username}: `}
      {message.deletedAt ? (
        'DELETED'
      ) : (
        <>
          {markdown}
          {formattedEditDate}
        </>
      )}
      <MessageMenu message={message} channelId={channelId} />
    </div>
  );
}
