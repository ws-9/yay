import { useInfiniteQuery } from '@tanstack/react-query';
import type { CursorPaginatedChannelMessages } from '../types/CursorPaginatedChannelMessages';
import type { ChannelMessagePageParam } from '../types/ChannelMessagePageParam';
import { getTokenState } from '../store/authStore';
import { API_CHANNELS, CHANNEL_MESSAGES_PAGE_SIZE } from '../constants';

export function useInfChannelMessagesQuery(channelId: number) {
  const {
    data,
    error,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['channels', channelId, 'messages'],
    queryFn: fetchMessages,
    initialPageParam: {
      id: channelId,
      size: CHANNEL_MESSAGES_PAGE_SIZE,
      cursor: null as string | null,
      cursorId: null as number | null,
    },
    getNextPageParam: lastPage => {
      if (!lastPage.hasNext) {
        return undefined;
      }

      return {
        id: channelId,
        size: CHANNEL_MESSAGES_PAGE_SIZE,
        cursor: lastPage.nextCursor,
        cursorId: lastPage.nextCursorId,
      };
    },
  });

  return {
    data,
    error,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
}

async function fetchMessages({
  pageParam,
  queryKey,
}: {
  pageParam: ChannelMessagePageParam;
  queryKey: (string | number)[];
}): Promise<CursorPaginatedChannelMessages> {
  const { token } = getTokenState();
  const [, channelId] = queryKey;

  const params = new URLSearchParams({
    size: CHANNEL_MESSAGES_PAGE_SIZE.toString(),
  });

  if (pageParam.cursor) {
    params.append('cursor', pageParam.cursor);
  }
  if (pageParam.cursorId) {
    params.append('cursorId', pageParam.cursorId.toString());
  }

  const response = await fetch(
    `${API_CHANNELS}/${channelId}/messages?${params}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
}
