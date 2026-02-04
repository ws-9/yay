package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotNull;

public record UpdateRoleRequest(
    @NotNull long communityId,
    @NotNull long userId,
    @NotNull String role
) {
}
