import { create } from 'zustand';

type UIStore = {
  channelDialog: {
    isOpen: boolean;
    communityId: number | null;
  };
  communitySettingsDialog: {
    isOpen: boolean;
    communityId: number | null;
  };
  channelSettingsDialog: {
    isOpen: boolean;
    channelId: number | null;
  };
  shareInviteDialog: {
    isOpen: boolean;
    communityId: number | null;
  };
  actions: {
    openChannelDialog: (communityId: number) => void;
    closeChannelDialog: () => void;
    openCommunitySettingsDialog: (communityId: number) => void;
    closeCommunitySettingsDialog: () => void;
    openChannelSettingsDialog: (channelId: number) => void;
    closeChannelSettingsDialog: () => void;
    openShareInviteDialog: (communityId: number) => void;
    closeShareInviteDialog: () => void;
  };
};

export const useUIStore = create<UIStore>(set => ({
  channelDialog: {
    isOpen: false,
    communityId: null,
  },
  communitySettingsDialog: {
    isOpen: false,
    communityId: null,
  },
  channelSettingsDialog: {
    isOpen: false,
    channelId: null,
  },
  shareInviteDialog: {
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
    openCommunitySettingsDialog: (communityId: number) =>
      set({
        communitySettingsDialog: {
          isOpen: true,
          communityId,
        },
      }),
    closeCommunitySettingsDialog: () =>
      set({
        communitySettingsDialog: {
          isOpen: false,
          communityId: null,
        },
      }),
    openChannelSettingsDialog: (channelId: number) =>
      set({
        channelSettingsDialog: {
          isOpen: true,
          channelId,
        },
      }),
    closeChannelSettingsDialog: () =>
      set({
        channelSettingsDialog: {
          isOpen: false,
          channelId: null,
        },
      }),
    openShareInviteDialog: (communityId: number) =>
      set({
        shareInviteDialog: {
          isOpen: true,
          communityId,
        },
      }),
    closeShareInviteDialog: () =>
      set({
        shareInviteDialog: {
          isOpen: false,
          communityId: null,
        },
      }),
  },
}));

export const useUiStoreActions = () => useUIStore(state => state.actions);

export const useChannelDialog = () => useUIStore(state => state.channelDialog);

export const useCommunitySettingsDialog = () =>
  useUIStore(state => state.communitySettingsDialog);

export const useChannelSettingsDialog = () =>
  useUIStore(state => state.channelSettingsDialog);

export const useShareInviteDialog = () =>
  useUIStore(state => state.shareInviteDialog);
