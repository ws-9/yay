package com.ws.yay_backend.dto.response;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record AuthenticationResponse(
    @NotNull String jwtToken,
    @NotNull String username,
    @NotNull long id,
    @NotNull List<String> roles
) {
}