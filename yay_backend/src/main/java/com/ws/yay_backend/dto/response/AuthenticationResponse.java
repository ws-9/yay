package com.ws.yay_backend.dto.response;

import jakarta.validation.constraints.NotNull;

public record AuthenticationResponse(
    @NotNull String jwtToken
) {
}