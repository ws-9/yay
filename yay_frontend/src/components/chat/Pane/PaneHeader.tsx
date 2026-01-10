import { useEffect, useState } from 'react';
import { useChannelQuery } from '../../../hooks/useChannelQuery';
import { useWorkspaceActions } from '../../../store/workspaceStore';
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

  return (
    <div className="flex gap-2 border-b bg-gray-100 p-1">
      {channelId !== null && (
        <div
          draggable={mode === 'multi'}
          className="border-b-2"
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
  const [open, setOpen] = useState(false);
  const isSmallScreen = useMinBreakpoint('sm');

  useEffect(() => {
    if (!isSmallScreen) {
      setOpen(false);
    }
  }, [isSmallScreen]);

  return (
    <Menu.Root open={open} onOpenChange={setOpen}>
      <Menu.Trigger className="ml-auto hidden h-8 items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2 text-base font-medium text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 data-[popup-open]:bg-gray-100 sm:flex">
        ⋮
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className="outline-none" sideOffset={8}>
          <Menu.Popup className="origin-[var(--transform-origin)] rounded-md bg-[canvas] py-1 text-gray-900 shadow-lg shadow-gray-200 outline outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
            <Menu.Arrow className="data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180">
              <ArrowSvg />
            </Menu.Arrow>

            <Menu.Item
              onClick={e => {
                e.stopPropagation();
                splitNode(nodeId, 'north');
              }}
              className="flex cursor-default items-center gap-2 py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900"
            >
              <span>↑</span> Split Up
            </Menu.Item>

            <Menu.Item
              onClick={e => {
                e.stopPropagation();
                splitNode(nodeId, 'south');
              }}
              className="flex cursor-default items-center gap-2 py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900"
            >
              <span>↓</span> Split Down
            </Menu.Item>

            <Menu.Item
              onClick={e => {
                e.stopPropagation();
                splitNode(nodeId, 'west');
              }}
              className="flex cursor-default items-center gap-2 py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900"
            >
              <span>←</span> Split Left
            </Menu.Item>

            <Menu.Item
              onClick={e => {
                e.stopPropagation();
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
                  onClick={e => {
                    e.stopPropagation();
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

function ArrowSvg(props: React.ComponentProps<'svg'>) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className="fill-[canvas]"
      />
      <path
        d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
        className="fill-gray-200 dark:fill-none"
      />
      <path
        d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
        className="dark:fill-gray-300"
      />
    </svg>
  );
}
