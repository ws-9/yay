package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateChannelMessageRequest(
    @NotNull @NotBlank @Size(min = 1, max = 2000) String message,
    @NotNull long channelId
) {
}
