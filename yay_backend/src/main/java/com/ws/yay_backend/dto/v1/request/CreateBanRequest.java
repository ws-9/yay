package com.ws.yay_backend.dto.v1.request;

import jakarta.validation.constraints.NotNull;

public record CreateBanRequest(@NotNull Long communityId, @NotNull Long userId) {}
