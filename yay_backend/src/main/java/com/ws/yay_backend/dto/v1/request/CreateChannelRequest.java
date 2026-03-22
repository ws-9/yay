package com.ws.yay_backend.dto.v1.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record CreateChannelRequest(
    @NotNull(message = "communityId required") Long communityId,
    @NotEmpty(message = "name required") String name) {}
