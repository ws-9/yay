import { useInfiniteQuery } from '@tanstack/react-query';
import { API_MESSAGES_V2, CHANNEL_MESSAGES_PAGE_SIZE } from '../../../constants';
import { queryKeysV2 } from '../../queryKeys';
import useFetchWithAuth from '../../useFetchWithAuth';
import type { MessageV2, CursorPaginatedResponseV2 } from '../../../types/v2';

export function useInfChannelMessagesV2Query(channelId: number) {
  const fetchWithAuth = useFetchWithAuth();

  return useInfiniteQuery<CursorPaginatedResponseV2<MessageV2>>({
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
  let url = `${API_MESSAGES_V2}?channelId=${channelId}&size=${CHANNEL_MESSAGES_PAGE_SIZE}`;

  if (pageParam) {
    url += `&cursor=${encodeURIComponent(pageParam.cursor)}&cursorId=${pageParam.cursorId}`;
  }

  const response = await fetchWithAuth(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch messages (V2): ${response.status}`);
  }

  return response.json();
}
