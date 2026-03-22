package com.ws.yay_backend.dto.v1.response;

import java.util.List;
import org.springframework.data.domain.Page;

public record PaginatedResponse<T>(
    List<T> data,
    int currentPage,
    int totalPages,
    long totalItems,
    int pageSize,
    boolean hasNext,
    boolean hasPrevious) {
  public PaginatedResponse(Page<T> page) {
    this(
        page.getContent(),
        page.getNumber(),
        page.getTotalPages(),
        page.getTotalElements(),
        page.getSize(),
        page.hasNext(),
        page.hasPrevious());
  }
}
