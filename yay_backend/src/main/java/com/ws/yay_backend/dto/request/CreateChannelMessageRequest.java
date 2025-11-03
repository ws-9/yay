package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotNull;

public record CreateChannelMessageRequest(
    @NotNull String message,
    @NotNull long channelId
) {
}
