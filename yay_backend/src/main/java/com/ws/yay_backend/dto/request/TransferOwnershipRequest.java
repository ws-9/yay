package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotNull;

public record TransferOwnershipRequest(
    @NotNull(message = "newOwnerId required") long newOwnerId
) {
}