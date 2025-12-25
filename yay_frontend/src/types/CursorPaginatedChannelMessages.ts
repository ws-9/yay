import type { ChannelMessage } from './ChannelMessage';

export type CursorPaginatedChannelMessages = {
  data: Array<ChannelMessage>;
  nextCursor: string;
  nextCursorId: number;
  hasNext: boolean;
};
