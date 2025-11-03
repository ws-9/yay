package com.ws.yay_backend.dto.response;

import jakarta.validation.constraints.NotNull;

public record GetChannelResponse(
    @NotNull Long id,
    @NotNull String name,
    @NotNull Long communityId
) {
}
