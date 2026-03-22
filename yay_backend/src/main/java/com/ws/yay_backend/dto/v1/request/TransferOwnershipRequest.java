package com.ws.yay_backend.dto.v1.request;

import jakarta.validation.constraints.NotNull;

public record TransferOwnershipRequest(@NotNull(message = "newOwnerId required") long newOwnerId) {}
