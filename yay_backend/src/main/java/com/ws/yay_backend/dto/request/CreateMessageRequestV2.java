package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateMessageRequestV2(@NotBlank String message, @NotNull Long channelId) {}
