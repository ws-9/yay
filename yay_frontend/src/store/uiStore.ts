import { create } from 'zustand';

type UIStore = {
  channelDialog: {
    isOpen: boolean;
    communityId: number | null;
  };
  actions: {
    openChannelDialog: (communityId: number) => void;
    closeChannelDialog: () => void;
  };
};

export const useUIStore = create<UIStore>(set => ({
  channelDialog: {
    isOpen: false,
    communityId: null,
  },
  actions: {
    openChannelDialog: (communityId: number) =>
      set({
        channelDialog: {
          isOpen: true,
          communityId,
        },
      }),
    closeChannelDialog: () =>
      set({
        channelDialog: {
          isOpen: false,
          communityId: null,
        },
      }),
  },
}));

export const useChannelDialogActions = () => useUIStore(state => state.actions);
export const useChannelDialog = () => useUIStore(state => state.channelDialog);
