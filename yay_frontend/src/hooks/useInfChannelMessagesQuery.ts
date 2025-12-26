import { useInfiniteQuery } from '@tanstack/react-query';
import type { CursorPaginatedChannelMessages } from '../types/CursorPaginatedChannelMessages';
import type { ChannelMessagePageParam } from '../types/ChannelMessagePageParam';
import { useTokenState } from '../store/authStore';
import { API_CHANNELS, CHANNEL_MESSAGES_PAGE_SIZE } from '../constants';

export function useInfChannelMessagesQuery(selectedChannel: number) {
  const { data, error, status, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['channels', selectedChannel, 'messages'],
    queryFn: fetchMessages,
    initialPageParam: {
      id: selectedChannel,
      size: CHANNEL_MESSAGES_PAGE_SIZE,
      cursor: null as string | null,
      cursorId: null as number | null,
    },
    getNextPageParam: lastPage => {
      if (!lastPage.hasNext) {
        return undefined;
      }

      return {
        id: selectedChannel,
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
  };
}

async function fetchMessages({
  pageParam,
  queryKey,
}: {
  pageParam: ChannelMessagePageParam;
  queryKey: (string | number)[];
}): Promise<CursorPaginatedChannelMessages> {
  const { token } = useTokenState();
  const [, selectedChannel] = queryKey;

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
    `${API_CHANNELS}/${selectedChannel}/messages?${params}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
}
