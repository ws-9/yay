import { Client } from '@stomp/stompjs';
import { create } from 'zustand';
import { useTokenState } from './authStore';

type WebSocketStore = {
  client: Client | null;
  connected: boolean;
  actions: {
    connect: (brokerURL: string) => void;
    disconnect: () => void;
    subscribe: (
      destination: string,
      callback: (message: any) => void,
    ) => () => void;
  };
};

const useWebSocketStore = create<WebSocketStore>()((set, get) => ({
  client: null,
  connected: false,
  actions: {
    connect: brokerURL => {
      const { client: currentClient } = get();
      if (currentClient?.connected) {
        return;
      }

      const token = useTokenState().token;

      const client = new Client({
        brokerURL,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        onConnect: () => {
          console.log('Connected to websocket');
          set({ connected: true });
        },
        onDisconnect: () => {
          console.log('Disconnected from websocket');
          set({ connected: false });
        },
        onStompError: frame => {
          console.error('STOMP error:', frame);
        },
      });

      client.activate();
      set({ client });
    },
    disconnect: () => {
      const { client } = get();
      if (client) {
        client.deactivate();
        set({ client: null, connected: false });
      }
    },
    subscribe: (destination, callback) => {
      const { client } = get();
      if (!client?.connected) {
        console.warn('WebSocket not connected');
        return () => {};
      }

      console.log('Subscribing');
      const subscription = client.subscribe(destination, message => {
        const payload = JSON.parse(message.body);
        callback(payload);
      });

      return () => {
        console.log('Unsubscribing');
        subscription.unsubscribe();
      };
    },
  },
}));

export function useWebSocketActions() {
  return useWebSocketStore(state => state.actions);
}

export function useWebSocketConnectedStatus() {
  return useWebSocketStore(state => state.connected);
}

export function useWebSocketClient() {
  return useWebSocketStore(state => state.client);
}
