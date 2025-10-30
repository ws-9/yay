package com.ws.yay_backend.response;

import jakarta.validation.constraints.NotNull;

public record GetChannelMessageResponse(
    @NotNull long id,
    @NotNull String message,
    @NotNull long userId,
    @NotNull long channelId
) {
}
