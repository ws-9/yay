import type { GetChannelMessageResponse } from './GetChannelMessageResponse';

export type CursorPaginatedChannelMessages = {
  data: Array<GetChannelMessageResponse>;
  nextCursor: string;
  nextCursorId: number;
  hasNext: boolean;
};
