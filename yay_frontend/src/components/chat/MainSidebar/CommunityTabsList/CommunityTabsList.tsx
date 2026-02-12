import useMyCommunitiesQuery from '../../../../hooks/useMyCommunitiesQuery';
import { useWorkspaceActions } from '../../../../store/workspaceStore';
import { Accordion } from '@base-ui/react/accordion';
import { useEffect, useEffectEvent } from 'react';
import CommunityTab from './CommunityTab';

export default function CommunityTabsList() {
  const { data, isLoading, error } = useMyCommunitiesQuery();
  const { removeNodesNotInChannelList } = useWorkspaceActions();

  const handleCleanupInaccessibleChannels = useEffectEvent(
    (accessibleChannels: number[]) => {
      removeNodesNotInChannelList(accessibleChannels);
    },
  );

  useEffect(() => {
    if (data) {
      const accessibleChannels = data.flatMap(c => c.channels.map(ch => ch.id));
      handleCleanupInaccessibleChannels(accessibleChannels);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  const communityTabs = data?.map(community => (
    <CommunityTab
      key={community.id}
      communityId={community.id}
      name={community.name}
      role={community.role!}
      channels={community.channels ?? []}
    />
  ));

  return (
    <Accordion.Root className="flex flex-col text-gray-900">
      {communityTabs}
    </Accordion.Root>
  );
}
