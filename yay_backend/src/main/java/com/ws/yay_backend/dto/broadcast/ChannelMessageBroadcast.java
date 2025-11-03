package com.ws.yay_backend.dto.broadcast;

import jakarta.validation.constraints.NotNull;

public record ChannelMessageBroadcast(
    @NotNull long id,
    @NotNull String message,
    @NotNull long userId,
    @NotNull long channelId
) {
}