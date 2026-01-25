package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotNull;

public record DeleteChannelMessageRequest(
    @NotNull long messageId
) {
}
