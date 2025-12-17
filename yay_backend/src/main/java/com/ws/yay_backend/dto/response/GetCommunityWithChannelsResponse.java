package com.ws.yay_backend.dto.response;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record GetCommunityWithChannelsResponse(
    @NotNull long id,
    @NotNull String name,
    @NotNull long ownerId,
    @NotNull String ownerUsername,
    @NotNull List<GetChannelResponse> channels
) {
}
