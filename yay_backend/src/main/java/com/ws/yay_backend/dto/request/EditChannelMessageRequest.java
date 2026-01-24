package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record EditChannelMessageRequest(
    @NotNull long id,
    @NotNull @NotBlank @Size(min = 1, max = 2000) String message
) {
}