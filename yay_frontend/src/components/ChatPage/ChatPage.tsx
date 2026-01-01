import MainSidebar from './MainSidebar';
import { useIsAuthenticated } from '../../store/authStore';
import { useEffect } from 'react';
import { WS_BROKER } from '../../constants';
import { useWebSocketActions } from '../../store/webSocketStore';
import { useWorkspaceRoot } from '../../store/workspaceStore';
import BSPChatNodeRender from '../BSPChatNodeRender/BSPChatNodeRender';

export default function ChatPage() {
  const isAuthenticated = useIsAuthenticated();
  const rootNode = useWorkspaceRoot();

  const { connect } = useWebSocketActions();
  useEffect(() => {
    if (isAuthenticated) {
      connect(WS_BROKER);
    }
  }, [isAuthenticated, connect]);
  return (
    <div className="grid h-screen grid-cols-[1fr] grid-rows-[100dvh] sm:grid-cols-[15rem_1fr]">
      <MainSidebar />
      <BSPChatNodeRender node={rootNode} />
    </div>
  );
}
