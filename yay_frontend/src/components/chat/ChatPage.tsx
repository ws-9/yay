import MainSidebar from './MainSidebar/MainSidebar';
import { useIsAuthenticated } from '../../store/authStore';
import { useEffect, Activity } from 'react';
import { WS_BROKER } from '../../constants';
import { useWebSocketActions } from '../../store/webSocketStore';
import { useWorkspaceRoot, useActivePane } from '../../store/workspaceStore';
import BSPChatNodeRender from './BSPChatNodeRender';
import useMinBreakpoint from '../../hooks/useMinBreakpoint';
import ChatPane from './Pane/ChatPane';
import { ErrorHandlingToast } from './MainSidebar/ErrorHandlingToast';
import ChannelDialog from './dialogs/ChannelDialog';
import ChannelSettingsDialog from './dialogs/ChannelSettingsDialog/ChannelSettingsDialog';
import CommunitySettingDialog from './dialogs/CommunitySettingsDialog/CommunitySettingDialog';
import ShareInviteDialog from './dialogs/ShareInviteDialog/ShareInviteDialog';

export default function ChatPage() {
  const isAuthenticated = useIsAuthenticated();
  const { connect } = useWebSocketActions();

  useEffect(() => {
    if (isAuthenticated) {
      connect(WS_BROKER);
    }
  }, [isAuthenticated, connect]);

  return (
    <div className="grid h-screen grid-cols-[1fr] grid-rows-[100dvh] sm:grid-cols-[15rem_1fr]">
      <MainSidebar />
      <SingleActivePaneRenderer />
      <MultiPaneRenderer />
      <ChannelDialog />
      <ChannelSettingsDialog />
      <CommunitySettingDialog />
      <ErrorHandlingToast />
      <ShareInviteDialog />
    </div>
  );
}

function MultiPaneRenderer() {
  const rootNode = useWorkspaceRoot();
  return (
    <div className="hidden sm:block">
      <BSPChatNodeRender node={rootNode} />
    </div>
  );
}

function SingleActivePaneRenderer() {
  const activePane = useActivePane();
  const isMinSm = useMinBreakpoint('sm');

  // will pause subscriptions
  return (
    <Activity mode={isMinSm ? 'hidden' : 'visible'}>
      <ChatPane
        channelId={activePane.channelId}
        nodeId={activePane.id}
        mode="single"
      />
    </Activity>
  );
}
