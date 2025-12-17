package com.ws.yay_backend.dto.response;

import jakarta.validation.constraints.NotNull;

public record SimpleErrorResponse(@NotNull String error) {
}
