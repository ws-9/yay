import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import { Menu } from '@base-ui/react/menu';

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

function MessageMenu() {
  return (
    <Menu.Root>
      <Menu.Trigger
        onClick={event => event.stopPropagation()}
        className="absolute top-0 right-0 mr-1 h-max rounded-md border border-gray-200 bg-gray-50 px-2 text-base font-medium text-gray-900 opacity-0 select-none group-hover:opacity-100 hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 data-popup-open:bg-gray-100"
      >
        ⋮
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner className="outline-none" sideOffset={3}>
          <Menu.Popup
            onClick={event => event.stopPropagation()}
            className="origin-(--transform-origin) rounded-md bg-[canvas] py-1 text-gray-900 shadow-lg shadow-gray-200 outline outline-gray-200 transition-[transform,scale,opacity] data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300"
          >
            <Menu.Item className="flex cursor-default items-center gap-2 py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-highlighted:relative data-highlighted:z-0 data-highlighted:text-gray-50 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-gray-900">
              Edit Message
            </Menu.Item>
            <Menu.Item className="flex cursor-default items-center gap-2 py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-highlighted:relative data-highlighted:z-0 data-highlighted:text-gray-50 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-gray-900">
              Delete Message
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
