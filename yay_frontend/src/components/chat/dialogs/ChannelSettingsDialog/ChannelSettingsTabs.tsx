import { Separator } from '@base-ui/react/separator';
import { Tabs } from '@base-ui/react/tabs';
import { useChannelQuery } from '../../../../hooks/queries/useChannelQuery';
import PermissionsPanel from './PermissionsPanel';

export default function ChannelSettingsTabs({
  channelId,
}: {
  channelId: number | null;
}) {
  const { data } = useChannelQuery(channelId);

  if (!channelId || !data) {
    return null;
  }
  return (
    <Tabs.Root
      className="flex h-full w-full"
      defaultValue="general"
      orientation="vertical"
    >
      <Tabs.List className="flex w-48 flex-col gap-1 border-r border-gray-200 bg-gray-50 p-2">
        <h1>{data.name}</h1>
        <Separator orientation="horizontal" className="h-px bg-gray-300" />
        <Tabs.Tab
          className="flex h-10 items-center justify-start rounded px-3 text-sm font-medium text-gray-600 outline-none select-none hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 data-active:bg-white data-active:text-gray-900 data-active:shadow-sm"
          value="general"
        >
          General
        </Tabs.Tab>
        <Tabs.Tab
          className="flex h-10 items-center justify-start rounded px-3 text-sm font-medium text-gray-600 outline-none select-none hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 data-active:bg-white data-active:text-gray-900 data-active:shadow-sm"
          value="members"
        >
          Permissions
        </Tabs.Tab>
        <Tabs.Tab
          className="flex h-10 items-center justify-start rounded px-3 text-sm font-medium text-gray-600 outline-none select-none hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 data-active:bg-white data-active:text-gray-900 data-active:shadow-sm"
          value="advanced"
        >
          Advanced
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel className="flex-1 space-y-4 p-6" value="general">
        <h2 className="text-2xl font-bold">General</h2>
        <p className="text-gray-600">General channel settings.</p>
      </Tabs.Panel>
      <PermissionsPanel channelId={channelId} />
      <Tabs.Panel className="flex-1 space-y-4 p-6" value="advanced">
        <h2 className="text-2xl font-bold">Advanced</h2>
        <p className="text-gray-600">Advanced settings and configurations.</p>
      </Tabs.Panel>
    </Tabs.Root>
  );
}
