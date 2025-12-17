package com.ws.yay_backend.dto.response;

import jakarta.validation.constraints.NotNull;

public record GetMemberResponse(
    @NotNull long id,
    @NotNull String username
) {
}
