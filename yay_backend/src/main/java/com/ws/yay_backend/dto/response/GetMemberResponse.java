package com.ws.yay_backend.dto.response;

import jakarta.validation.constraints.NotNull;

public record GetMemberResponse(
    @NotNull long userId,
    @NotNull String username,
    @NotNull long communityId,
    @NotNull String communityName,
    @NotNull CommunityRoleResponse role
) {
}
