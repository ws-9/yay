import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import MessageMenu from './MessageMenu';

export function MessageRender({
  username,
  message,
  createdAt,
  updatedAt,
  deletedAt,
}: {
  username: string;
  message: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}) {
  const formattedDate = format(new Date(createdAt), 'MM/dd/yyyy HH:mm:ss');

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
      {message}
    </Markdown>
  );

  const formattedEditDate = updatedAt && (
    <>
      {' '}
      <span>
        (Updated: {format(new Date(updatedAt), 'MM/dd/yyyy HH:mm:ss')})
      </span>
    </>
  );

  return (
    <div className="group relative pr-8 hover:bg-gray-100">
      {`${formattedDate} ${username}: `}
      {deletedAt ? (
        'DELETED'
      ) : (
        <>
          {markdown}
          {formattedEditDate}
        </>
      )}
      <MessageMenu />
    </div>
  );
}
