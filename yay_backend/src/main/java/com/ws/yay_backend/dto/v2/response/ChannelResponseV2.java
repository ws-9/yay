package com.ws.yay_backend.dto.v2.response;

import com.ws.yay_backend.entity.Channel;
import jakarta.validation.constraints.NotNull;

public record ChannelResponseV2(@NotNull long id, @NotNull String name, @NotNull long communityId) {
  public static ChannelResponseV2 fromEntity(Channel channel) {
    return new ChannelResponseV2(
        channel.getId(), channel.getName(), channel.getCommunity().getId());
  }
}
