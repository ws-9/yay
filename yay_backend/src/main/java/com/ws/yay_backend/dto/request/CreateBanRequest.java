package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotNull;

public record CreateBanRequest(
    @NotNull Long communityId,
    @NotNull Long userId
) {}