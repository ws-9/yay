package com.ws.yay_backend.dto.v1.response;

import jakarta.validation.constraints.NotNull;

public record UserInfoResponse(@NotNull String username, @NotNull long id) {}
