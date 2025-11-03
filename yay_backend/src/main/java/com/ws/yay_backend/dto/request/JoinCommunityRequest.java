package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotNull;

public record JoinCommunityRequest(
    @NotNull(message = "communityId required") Long communityId
) {
}
