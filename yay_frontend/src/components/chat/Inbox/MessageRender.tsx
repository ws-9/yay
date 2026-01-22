import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';

export function MessageRender({
  username,
  message,
  createdAt,
}: {
  username: string;
  message: string;
  createdAt: string;
}) {
  const formattedDate = format(new Date(createdAt), 'MM/dd/yyyy HH:mm:ss');
  return (
    <div>
      {`${formattedDate} ${username}: `}
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
    </div>
  );
}
