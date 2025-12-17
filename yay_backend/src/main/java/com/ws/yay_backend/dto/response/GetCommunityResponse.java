package com.ws.yay_backend.dto.response;

import jakarta.validation.constraints.NotNull;

public record GetCommunityResponse(
    @NotNull long id,
    @NotNull String name,
    @NotNull long ownerId,
    @NotNull String ownerUsername
) {
}
