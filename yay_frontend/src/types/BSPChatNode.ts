export type SplitDirection = 'north' | 'east' | 'south' | 'west';

// Either displays a channel (if channelId is not null) or displays a split
export type BSPChatNode =
  | {
      type: 'pane';
      id: string;
      channelId: number | null;
    }
  | {
      type: 'split';
      id: string;
      direction: SplitDirection;
      left: BSPChatNode;
      right: BSPChatNode;
    };
