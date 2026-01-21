package com.ws.yay_backend.dto.response;

import jakarta.validation.constraints.NotNull;

public record UserInfoResponse(
    @NotNull String username,
    @NotNull long id
) {
}
