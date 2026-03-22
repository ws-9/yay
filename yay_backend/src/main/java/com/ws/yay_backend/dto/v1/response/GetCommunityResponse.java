package com.ws.yay_backend.dto.v1.response;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetCommunityResponse(
    @NotNull long id,
    @NotNull String name,
    @NotNull long ownerId,
    @NotNull String ownerUsername,
    CommunityRoleResponse role,
    List<GetChannelResponse> channels) {}
