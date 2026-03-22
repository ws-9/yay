package com.ws.yay_backend.dto.v1.response;

import jakarta.validation.constraints.NotNull;

public record AuthenticationResponse(@NotNull String jwtToken) {}
