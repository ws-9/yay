package com.ws.yay_backend.dto.v2.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateMessageRequestV2(@NotBlank String message) {}
