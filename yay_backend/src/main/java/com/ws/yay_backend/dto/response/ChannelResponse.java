package com.ws.yay_backend.dto.response;

import com.ws.yay_backend.entity.Channel;
import jakarta.validation.constraints.NotNull;

public record ChannelResponse(@NotNull long id, @NotNull String name, @NotNull long communityId) {
  public static ChannelResponse fromEntity(Channel channel) {
    return new ChannelResponse(channel.getId(), channel.getName(), channel.getCommunity().getId());
  }
}
