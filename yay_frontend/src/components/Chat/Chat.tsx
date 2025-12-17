import MainSidebar from './MainSidebar';
import ChatNode from './ChatNode';
import { useIsAuthenticated } from '../../store/authStore';
import { useEffect } from 'react';
import { WS_BROKER } from '../../constants';
import { useWebSocketActions } from '../../store/webSocketStore';

export default function Chat() {
  const isAuthenticated = useIsAuthenticated();

  const { connect } = useWebSocketActions();
  useEffect(() => {
    if (isAuthenticated) {
      connect(WS_BROKER);
    }
  }, [isAuthenticated, connect]);
  return (
    <div className="grid min-h-screen grid-cols-[1fr] sm:grid-cols-[15rem_1fr] lg:grid-cols-[15rem_1fr_15rem]">
      <MainSidebar />
      <ChatNode />
      <div className="hidden bg-gray-300 lg:block">Secondary bar</div>
    </div>
  );
}
