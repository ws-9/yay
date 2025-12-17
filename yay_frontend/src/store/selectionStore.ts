import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type selectionStore = {
  selectedChannel: number | null;
  actions: {
    selectChannel: (channelId: number) => void;
  };
};

const useSelectionStore = create<selectionStore>()(
  persist(
    set => ({
      selectedChannel: null,
      actions: {
        selectChannel: channelId => set({ selectedChannel: channelId }),
      },
    }),
    {
      name: 'selection-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => ({ selectedChannel: state.selectedChannel }),
    },
  ),
);

export function useSelectedChannel() {
  return useSelectionStore(state => state.selectedChannel);
}

export function useSelectedActions() {
  return useSelectionStore(state => state.actions);
}
