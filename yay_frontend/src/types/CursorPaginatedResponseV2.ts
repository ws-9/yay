export type CursorPaginatedResponseV2<T> = {
  data: T[];
  nextCursor: string | null; // ISO-8601 string or null
  nextCursorId: number | null;
  hasNext: boolean;
};
