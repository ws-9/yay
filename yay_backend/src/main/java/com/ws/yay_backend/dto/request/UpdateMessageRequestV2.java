package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateMessageRequestV2(@NotBlank String message) {}
