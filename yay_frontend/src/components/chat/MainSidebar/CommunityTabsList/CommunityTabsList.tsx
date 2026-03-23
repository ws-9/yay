import { useCommunitiesV2Query } from '../../../../hooks/queries/v2/useCommunitiesV2Query';
import { useChannelsV2Query } from '../../../../hooks/queries/v2/useChannelsV2Query';
import { useWorkspaceActions } from '../../../../store/workspaceStore';
import { Accordion } from '@base-ui/react/accordion';
import { useEffect, useEffectEvent } from 'react';
import CommunityTab from './CommunityTab';

export default function CommunityTabsList() {
  const {
    data: communities,
    isLoading: isLoadingCommunities,
    error: errorCommunities,
  } = useCommunitiesV2Query();
  const communityIds = communities?.map(c => c.id) ?? [];
  const { data: channels, isLoading: isLoadingChannels } =
    useChannelsV2Query(communityIds);

  const { removeNodesNotInChannelList } = useWorkspaceActions();

  const handleCleanupInaccessibleChannels = useEffectEvent(
    (accessibleChannels: number[]) => {
      removeNodesNotInChannelList(accessibleChannels);
    },
  );

  useEffect(() => {
    if (channels) {
      const accessibleChannels = channels.map(ch => ch.id);
      handleCleanupInaccessibleChannels(accessibleChannels);
    }
  }, [channels]);

  if (isLoadingCommunities || isLoadingChannels) {
    return <div>Loading</div>;
  }

  if (errorCommunities) {
    return <div>error</div>;
  }

  const communityTabs = communities?.map(community => (
    <CommunityTab
      key={community.id}
      communityId={community.id}
      name={community.name}
    />
  ));

  return (
    <Accordion.Root className="flex flex-col text-gray-900">
      {communityTabs}
    </Accordion.Root>
  );
}
