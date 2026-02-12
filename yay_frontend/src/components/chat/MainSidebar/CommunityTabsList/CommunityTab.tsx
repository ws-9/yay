import { Accordion } from '@base-ui/react/accordion';
import CommunityMenu from '../CommunityMenu';
import type { CommunityRole } from '../../../../types/CommunityRole';
import ChannelTab from './ChannelTab';
import type { Channel } from '../../../../types/Channel';

export default function CommunityTab({
  name,
  role,
  channels,
  communityId,
}: {
  name: string;
  role: CommunityRole;
  channels: Array<Channel>;
  communityId: number;
}) {
  const channelTabs = channels.map(channel => (
    <ChannelTab key={channel.id} name={channel.name} id={channel.id} />
  ));

  return (
    <Accordion.Item className="border-b border-gray-200">
      <Accordion.Header className="flex hover:bg-gray-100">
        <Accordion.Trigger
          render={<div />}
          nativeButton={false}
          className="group relative flex w-full items-baseline justify-between gap-4 py-2 pr-1 pl-3 text-left font-medium focus-visible:z-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800"
        >
          {name}
          <PlusIcon className="mr-2 size-3 shrink-0 transition-all ease-out group-data-[panel-open]:scale-110 group-data-[panel-open]:rotate-45" />
          <CommunityMenu role={role} communityId={communityId} />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel className="h-[var(--accordion-panel-height)] overflow-hidden text-base text-gray-600 transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
        {channelTabs}
      </Accordion.Panel>
    </Accordion.Item>
  );
}

function PlusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 12 12" fill="currentcolor" {...props}>
      <path d="M6.75 0H5.25V5.25H0V6.75L5.25 6.75V12H6.75V6.75L12 6.75V5.25H6.75V0Z" />
    </svg>
  );
}
