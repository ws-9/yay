import { useChannelQuery } from '../../../hooks/queries/useChannelQuery';
import {
  useIsActivePane,
  useWorkspaceActions,
} from '../../../store/workspaceStore';
import type { DropZonesHandle } from './DropZones';
import { Menu } from '@base-ui/react/menu';
import useMinBreakpoint from '../../../hooks/useMinBreakpoint';

export default function PaneHeader({
  nodeId,
  channelId,
  dropZonesRef,
  mode,
}: {
  nodeId: string;
  channelId: number | null;
  dropZonesRef: React.RefObject<DropZonesHandle>;
  mode: 'single' | 'multi';
}) {
  const { data, isLoading } = useChannelQuery(channelId);
  const isActive = useIsActivePane(nodeId);

  return (
    <div className="flex gap-2 border-b bg-gray-100 p-1">
      {channelId !== null && (
        <div
          draggable={mode === 'multi'}
          className={`border-b-2 ${isActive ? 'text-black' : 'text-gray-500'}`}
          onDragStart={event => {
            event.dataTransfer.effectAllowed = 'copy';
            event.dataTransfer.setData('channelId', channelId.toString());
            event.dataTransfer.setData('nodeId', nodeId.toString());
            dropZonesRef.current?.disableDropZones();
          }}
          onDragEnd={() => {
            dropZonesRef.current?.enableDropZones();
          }}
        >
          {isLoading ? 'Loading' : `${data?.name} @ ${data?.communityName}`}
        </div>
      )}
      <HeaderMenu nodeId={nodeId} channelId={channelId} />
    </div>
  );
}

function HeaderMenu({
  nodeId,
  channelId,
}: {
  nodeId: string;
  channelId: number | null;
}) {
  const { splitNode, removeNode } = useWorkspaceActions();
  const showCloseButton = nodeId !== 'root' || channelId !== null;
  const isSmallScreen = useMinBreakpoint('sm');

  if (!isSmallScreen) {
    return null;
  }

  return (
    <Menu.Root>
      <Menu.Trigger
        onClick={event => event.stopPropagation()}
        className="ml-auto flex h-8 items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2 text-base font-medium text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 data-[popup-open]:bg-gray-100"
      >
        ⋮
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner className="outline-none" sideOffset={8}>
          <Menu.Popup
            onClick={event => event.stopPropagation()}
            className="origin-[var(--transform-origin)] rounded-md bg-[canvas] py-1 text-gray-900 shadow-lg shadow-gray-200 outline outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300"
          >
            <Menu.Item
              onClick={() => {
                splitNode(nodeId, 'north');
              }}
              className="flex cursor-default items-center gap-2 py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900"
            >
              <span>↑</span> Split Up
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                splitNode(nodeId, 'south');
              }}
              className="flex cursor-default items-center gap-2 py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900"
            >
              <span>↓</span> Split Down
            </Menu.Item>

            <Menu.Item
              onClick={() => {
                splitNode(nodeId, 'west');
              }}
              className="flex cursor-default items-center gap-2 py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900"
            >
              <span>←</span> Split Left
            </Menu.Item>

            <Menu.Item
              onClick={() => {
                splitNode(nodeId, 'east');
              }}
              className="flex cursor-default items-center gap-2 py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900"
            >
              <span>→</span> Split Right
            </Menu.Item>

            {showCloseButton && (
              <>
                <Menu.Separator className="mx-4 my-1.5 h-px bg-gray-200" />
                <Menu.Item
                  onClick={() => {
                    removeNode(nodeId);
                  }}
                  className="flex cursor-default items-center gap-2 py-2 pr-8 pl-4 text-sm leading-4 text-red-600 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-red-600"
                >
                  <span>✕</span> Close Pane
                </Menu.Item>
              </>
            )}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
