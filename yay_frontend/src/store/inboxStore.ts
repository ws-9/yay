import { create } from 'zustand';

type InboxStore = {
  scrollTrigger: number;
  actions: {
    scrollToBottom: () => void;
  };
};

const useInboxStore = create<InboxStore>(set => ({
  scrollTrigger: 0,
  actions: {
    scrollToBottom: () =>
      set(state => ({ scrollTrigger: state.scrollTrigger + 1 })),
  },
}));

export function useInboxActions() {
  return useInboxStore(state => state.actions);
}

export function useScrollTrigger() {
  return useInboxStore(state => state.scrollTrigger);
}
