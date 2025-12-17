package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotNull;

public record RemoveMemberRequest(
    @NotNull(message = "communityId required") long communityId,
    @NotNull(message = "userId required") long userId
) {
}
