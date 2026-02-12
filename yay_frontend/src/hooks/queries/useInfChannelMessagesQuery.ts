import { useInfiniteQuery } from '@tanstack/react-query';
import type { CursorPaginatedChannelMessages } from '../../types/CursorPaginatedChannelMessages';
import type { ChannelMessagePageParam } from '../../types/ChannelMessagePageParam';
import { API_CHANNELS, CHANNEL_MESSAGES_PAGE_SIZE } from '../../constants';
import { queryKeys } from '../queryKeys';
import useFetchWithAuth from '../useFetchWithAuth';

export function useInfChannelMessagesQuery(channelId: number) {
  const fetchWithAuth = useFetchWithAuth();

  const {
    data,
    error,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: queryKeys.channels.messages(channelId),
    queryFn: params => fetchMessages(params, fetchWithAuth),
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

async function fetchMessages(
  {
    pageParam,
    queryKey,
  }: {
    pageParam: ChannelMessagePageParam;
    queryKey: readonly unknown[];
  },
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
): Promise<CursorPaginatedChannelMessages> {
  const [, channelId] = queryKey as readonly [string, number, string];

  const params = new URLSearchParams({
    size: CHANNEL_MESSAGES_PAGE_SIZE.toString(),
  });

  if (pageParam.cursor) {
    params.append('cursor', pageParam.cursor);
  }
  if (pageParam.cursorId) {
    params.append('cursorId', pageParam.cursorId.toString());
  }

  const response = await fetchWithAuth(
    `${API_CHANNELS}/${channelId}/messages?${params}`,
    {
      method: 'GET',
    },
  );

  return response.json();
}
