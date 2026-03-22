package com.ws.yay_backend.dto.v1.response;

import java.time.Instant;
import java.util.List;

public record CursorPaginatedResponse<T>(
    List<T> data, Instant nextCursor, Long nextCursorId, boolean hasNext) {}
