import { useInfiniteQuery } from '@tanstack/react-query';
import { API_MESSAGES, CHANNEL_MESSAGES_PAGE_SIZE } from '../../constants';
import { queryKeysV2 } from '../queryKeys';
import useFetchWithAuth from '../useFetchWithAuth';
import type { Message, CursorPaginatedResponse } from '../../types';

export function useInfChannelMessagesQuery(channelId: number) {
  const fetchWithAuth = useFetchWithAuth();

  return useInfiniteQuery<CursorPaginatedResponse<Message>>({
    queryKey: queryKeysV2.messages.byChannel(channelId),
    queryFn: ({ pageParam }) =>
      getChannelMessages(fetchWithAuth, channelId, pageParam as any),
    initialPageParam: null,
    getNextPageParam: lastPage =>
      lastPage.hasNext
        ? { cursor: lastPage.nextCursor, cursorId: lastPage.nextCursorId }
        : null,
    enabled: !!channelId,
  });
}

async function getChannelMessages(
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
  channelId: number,
  pageParam: { cursor: string; cursorId: number } | null,
) {
  let url = `${API_MESSAGES}?channelId=${channelId}&size=${CHANNEL_MESSAGES_PAGE_SIZE}`;

  if (pageParam) {
    url += `&cursor=${encodeURIComponent(pageParam.cursor)}&cursorId=${pageParam.cursorId}`;
  }

  const response = await fetchWithAuth(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch messages (V2): ${response.status}`);
  }

  return response.json();
}
