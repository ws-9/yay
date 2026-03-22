package com.ws.yay_backend.dto.v1.response;

import jakarta.validation.constraints.NotNull;

public record GetChannelResponse(
    @NotNull long id,
    @NotNull String name,
    @NotNull long communityId,
    @NotNull String communityName) {}
