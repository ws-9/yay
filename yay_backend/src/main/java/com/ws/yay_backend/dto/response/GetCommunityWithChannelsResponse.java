package com.ws.yay_backend.dto.response;

import com.ws.yay_backend.entity.Channel;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record GetCommunityWithChannelsResponse(
    @NotNull
    Long id,
    @NotNull
    String name,
    @NotNull
    Long ownerId,
    @NotNull
    String ownerUsername,
    @NotNull
    List<GetChannelResponse> channels
) {
}
